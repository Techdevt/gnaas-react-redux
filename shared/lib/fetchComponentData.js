export default function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce( (prev, current) => {
    return current ? (current.needs || []).concat(prev) : prev;
  }, []);

  const promises = needs.map(need => {
  	return new Promise((resolve, reject) => {
  		const result = dispatch(need(params));
  		if(result) {
  			resolve(result);
  		} else {
  			reject(result);
  		}
  	});
  });
  
  return Promise.all(promises);
}