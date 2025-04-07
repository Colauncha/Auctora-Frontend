const links = {
  live: 'https://api-auctora.vercel.app/api/',
  local: 'http://localhost:8000/api/',
  host: 'https://biddius.com/api/',
};

const current = links.live;

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  let newString = s.charAt(0).toUpperCase() + s.slice(1)
  return newString
};

const charLimit = (s, limit) => {
  if (typeof s !== 'string') return ''
  if (s.length > limit) {
    return s.slice(0, limit) + '...'
  } return s
};

const currencyFormat = (num) => {
  const kobo = (num % 1).toFixed(2).substring(2);
  const naira = Math.floor(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return `₦${naira}.${kobo}`;
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} -- ${hours}:${minutes}`;
};


export {
  capitalize,
  currencyFormat,
  charLimit,
  links,
  current,
  formatDateTime
}