import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import arrowright from '../../../assets/svg/arrow-right.svg';
import x from '../../../assets/svg/x.svg';

import { current, authFetch } from '../../../utils';

import Loader from '../../../assets/loader2';
import LoaderW from '../../../assets/loaderWhite';

import { PlusSquare, CheckSquare2 } from 'lucide-react';
import { toast } from 'react-toastify';

/* -------------------------------- Utils -------------------------------- */

const apiFetch = async (url, options = {}) => {
  const res = await authFetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

/* ------------------------------ Component ------------------------------- */

const Categories = ({
  handleStepChange,
  activeStep,
  updateFormValidity,
  formData,
  updateFormData,
}) => {
  /* ------------------------------- State ------------------------------- */

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    formData?.item?.category_ids || []
  );
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState(
    formData?.item?.sub_category_ids || []
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [addSubCat, setAddSubCat] = useState(false);

  /* ---------------------------- Loading States --------------------------- */

  const [catLoading, setCatLoading] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSubCategory, setAddingSubCategory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const prevValidityRef = useRef(false);
  // Use a ref so the formData sync effect doesn't re-run when the parent
  // re-renders and recreates updateFormData.
  const updateFormDataRef = useRef(updateFormData);
  useEffect(() => { updateFormDataRef.current = updateFormData; });

  /* ----------------------------- Fetching ------------------------------ */

  const fetchCategories = useCallback(async () => {
    try {
      setCatLoading(true);
      const data = await apiFetch(`${current}categories`);
      setCategories(data.data || []);
      setFilteredCategories(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  /* ----------------------- Validity + formData sync ---------------------- */

  useEffect(() => {
    const isValid = selectedCategoryIds.length > 0;
    if (isValid !== prevValidityRef.current) {
      updateFormValidity(activeStep, isValid);
      prevValidityRef.current = isValid;
    }
    updateFormDataRef.current((prev) => ({
      ...prev,
      item: {
        ...prev.item,
        category_ids: selectedCategoryIds,
        sub_category_ids: selectedSubCategoryIds,
      },
    }));
  }, [selectedCategoryIds, selectedSubCategoryIds, activeStep, updateFormValidity]);

  /* ---------------------------- Handlers -------------------------------- */

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCategories(
      categories.filter((cat) => cat.name.toLowerCase().includes(query))
    );
  };

  const handleCategoryToggle = (cat) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(cat.id)) {
        // deselect: also drop all subcategories that belong to this category
        const subIds = new Set((cat.subcategories || []).map((s) => s.id));
        setSelectedSubCategoryIds((prevSubs) =>
          prevSubs.filter((id) => !subIds.has(id))
        );
        return prev.filter((id) => id !== cat.id);
      }
      return [...prev, cat.id];
    });
  };

  const handleSubCategoryToggle = (subcat) => {
    // Auto-select the parent category when a subcategory is checked
    if (
      selectedCategoryObj &&
      !selectedCategoryIds.includes(selectedCategoryObj.id)
    ) {
      setSelectedCategoryIds((prev) => [...prev, selectedCategoryObj.id]);
    }
    setSelectedSubCategoryIds((prev) =>
      prev.includes(subcat.id)
        ? prev.filter((id) => id !== subcat.id)
        : [...prev, subcat.id]
    );
  };

  const handleRemoveCategoryId = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      const subIds = new Set((cat.subcategories || []).map((s) => s.id));
      setSelectedSubCategoryIds((prev) => prev.filter((id) => !subIds.has(id)));
    }
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== catId));
  };

  const handleRemoveSubCategoryId = (subId) => {
    setSelectedSubCategoryIds((prev) => prev.filter((id) => id !== subId));
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSelectedSubCategoryIds([]);
    setSelectedCategoryObj(null);
  };

  /* ----------------------- Display name helpers ------------------------- */

  const getCategoryName = (catId) =>
    categories.find((c) => c.id === catId)?.name ?? catId;

  const getSubCategoryName = (subId) => {
    for (const cat of categories) {
      const sub = (cat.subcategories || []).find((s) => s.id === subId);
      if (sub) return sub.name;
    }
    return subId;
  };

  /* --------------------------- Add Category ----------------------------- */

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || addingCategory) return;
    try {
      setAddingCategory(true);
      const data = await apiFetch(`${current}categories`, {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDesc }),
      });
      if (!data.success) throw new Error(data.message);
      toast.success('Category added');
      setNewCategoryName('');
      setNewCategoryDesc('');
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  /* ----------------------- Add Sub Category ----------------------------- */

  const handleAddSubCategory = async () => {
    if (!newSubCategoryName.trim() || !selectedCategoryObj || addingSubCategory) return;
    try {
      setAddingSubCategory(true);
      const data = await apiFetch(`${current}subcategories`, {
        method: 'POST',
        body: JSON.stringify({
          name: newSubCategoryName,
          parent_id: selectedCategoryObj.id,
        }),
      });
      if (!data.success) throw new Error(data.message);
      toast.success('Subcategory added');
      setNewSubCategoryName('');
      setAddSubCat(false);
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add subcategory');
    } finally {
      setAddingSubCategory(false);
    }
  };

  /* ------------------------------ Submit -------------------------------- */

  const handleSubmit = async () => {
    if (submitting || selectedCategoryIds.length === 0) return;
    try {
      setSubmitting(true);
      updateFormData((prev) => {
        const updated = {
          ...prev,
          item: {
            ...prev.item,
            category_ids: selectedCategoryIds,
            sub_category_ids: selectedSubCategoryIds,
          },
        };
        sessionStorage.setItem('product', JSON.stringify(updated));
        return updated;
      });
      await new Promise((r) => setTimeout(r, 600));
      handleStepChange(activeStep + 1);
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------- UI ----------------------------------- */

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full py-8">
      <div className="formatter mx-auto max-w-7xl px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden md:grid md:grid-cols-3">
          {/* ---- Left: category list with checkboxes ---- */}
          <div className="p-6 border-r flex flex-col gap-3">
            <h2 className="font-semibold">Select Categories</h2>

            <input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search category..."
              className="w-full px-3 py-2 border rounded text-sm"
            />

            <div className="h-[260px] overflow-y-auto">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex items-center gap-2 w-full px-2 py-2 mb-1 rounded ${
                    selectedCategoryObj?.id === cat.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`cat-${cat.id}`}
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="cursor-pointer accent-[#9f3247]"
                  />
                  <label
                    htmlFor={`cat-${cat.id}`}
                    className="flex-1 text-sm cursor-pointer select-none"
                  >
                    {cat.name}
                  </label>
                  <button
                    onClick={() => setSelectedCategoryObj(cat)}
                    title="Browse subcategories"
                    className="text-gray-400 hover:text-[#9f3247] transition-colors"
                  >
                    <img src={arrowright} alt="" className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Category */}
            <div className="border-t pt-3 flex flex-col gap-2">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="w-full px-3 py-2 border rounded text-sm"
              />
              <input
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 border rounded text-sm"
              />
              <button
                onClick={handleAddCategory}
                disabled={addingCategory}
                className="w-full bg-maroon text-white py-2 rounded text-sm disabled:opacity-50"
              >
                {addingCategory ? 'Adding…' : 'Add Category'}
              </button>
            </div>
          </div>

          {/* ---- Right: subcategory list ---- */}
          <div className="col-span-2 p-6">
            {catLoading && <Loader />}

            {!catLoading && !selectedCategoryObj && (
              <p className="text-gray-400 text-sm mt-4">
                Click the → arrow next to a category to browse its
                subcategories.
              </p>
            )}

            {!catLoading && selectedCategoryObj && (
              <>
                <h3 className="font-semibold mb-4 text-[#9f3247]">
                  {selectedCategoryObj.name}
                  <span className="font-normal text-gray-500 text-sm ml-2">
                    — select subcategories
                  </span>
                </h3>

                {selectedCategoryObj.subcategories?.length === 0 ? (
                  <p className="text-gray-400 text-sm">No subcategories yet.</p>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedCategoryObj.subcategories &&
                      selectedCategoryObj.subcategories.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-2 cursor-pointer text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubCategoryIds.includes(item.id)}
                            onChange={() => handleSubCategoryToggle(item)}
                            className="accent-[#9f3247]"
                          />
                          {item.name}
                        </label>
                      ))}
                  </div>
                )}

                {/* Add subcategory */}
                <div className="flex items-center gap-2 mt-4">
                  <PlusSquare
                    onClick={() => setAddSubCat(!addSubCat)}
                    className="cursor-pointer text-gray-500 hover:text-[#9f3247]"
                    size={20}
                  />
                  {addSubCat && (
                    <>
                      <input
                        value={newSubCategoryName}
                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                        placeholder="Subcategory name"
                        className="border px-2 py-1 rounded text-sm"
                      />
                      <CheckSquare2
                        onClick={handleAddSubCategory}
                        size={20}
                        className={`cursor-pointer ${
                          addingSubCategory ? 'opacity-50' : 'text-emerald-500'
                        }`}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---- Bottom: selection chips + navigation ---- */}
        <div className="bg-gray-100 p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {selectedCategoryIds.map((catId) => (
              <span
                key={catId}
                className="bg-[#9f3247] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {getCategoryName(catId)}
                <button onClick={() => handleRemoveCategoryId(catId)}>
                  <img src={x} alt="remove" className="w-3 invert" />
                </button>
              </span>
            ))}
            {selectedSubCategoryIds.map((subId) => (
              <span
                key={subId}
                className="bg-white border border-[#9f3247] text-[#9f3247] px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {getSubCategoryName(subId)}
                <button onClick={() => handleRemoveSubCategoryId(subId)}>
                  <img src={x} alt="remove" className="w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {(selectedCategoryIds.length > 0 ||
              selectedSubCategoryIds.length > 0) && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting || selectedCategoryIds.length === 0}
              className="bg-maroon text-white px-6 py-2 rounded-full disabled:opacity-50 flex items-center"
            >
              {submitting ? <LoaderW /> : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- PropTypes ----------------------------- */

Categories.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  updateFormValidity: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default Categories;
