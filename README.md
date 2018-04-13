
# sailsjs-elasticsearch  
Using elasticsearch in sailsJS framework. Index/Reindex, Search  
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/Sect0R/sailsjs-elasticsearch) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Sect0R/sailsjs-elasticsearch/compare?expand=1)

## Documentation
  
### Example reindex command
```javascript
$http.get('/api/elastic/reindex')
.then(() => {  
	 // ... 
 });
 ```
  
### Example search request
```javascript  
$http.get('/api/elastic/search?index=music&where=' +  
 JSON.stringify({  
  or: [  
		 { title:         { contains: 'linkin' } },  
		 { author:        { contains: 'linkin' } }  
	 ]
 }) + '&limit=30')
 .then(() => {  
	 //... 
 });```