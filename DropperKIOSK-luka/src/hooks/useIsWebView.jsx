const useIsWebView = () => {
  let params = new URLSearchParams(window.location.search);
  const isWebView = params.get('isWebView');
  
  return isWebView ?? false;
};

export default useIsWebView;

// const useIsWebView = () => {
//   const isWebView = localStorage.getItem('isWebView')
  
//   return isWebView ?? false;
// };

// export default useIsWebView;