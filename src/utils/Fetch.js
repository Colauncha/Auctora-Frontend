const Fetch = async ({
  url,
  requestData,
  token,
  method = 'GET',
  contentType = 'application/json',
}) => {
  let data = null;
  let error = null;

  const headers = {};
  let reqData = null;
  if (contentType && contentType !== 'multipart/form-data') {
    headers['Content-Type'] = contentType;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (requestData && contentType === 'multipart/form-data') {
    const formData = new FormData();
    Object.keys(requestData).forEach((key) => {
      formData.append(key, requestData[key]);
    });
    reqData = formData;
  } else if (requestData && contentType !== 'multipart/form-data') {
    reqData = JSON.stringify(requestData);
  }
  if (!url) {
    error = new Error('URL is required');
    return;
  }

  let res = await fetch(url, {
    method: method || 'GET',
    headers: headers,
    body: reqData,
  });
  if (!res.ok) {
    error = new Error(`HTTP error! status: ${res}`);
  }
  data = await res.json().catch((err) => {
    console.error('Fetch error:', err);
    error = err;
  });

  return { data, error, success: res.ok };
};

export default Fetch;
