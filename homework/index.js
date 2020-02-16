'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response); // if everything works well here is supposed to return the response in a JSON format
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  //the options = {} means that it is an object.
  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      //gia kathe object entry tou object, diladi gia kathe zeygari opws [[name:nikos], [age:25], [key:value]]
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function renderRepoDetails(repo, ul) {
    createAndAppend('li', ul, { text: repo.name });
  }

  //from now on the function calls are starting---------------------------------------------------------------------------------------

  let reposBanner = document.createElement('H1');
  reposBanner.innerHTML = 'HYF REPOSITORIES';
  document.getElementById('root').appendChild(reposBanner);
  reposBanner.className += 'banner';

  function main(url) {
    fetchJSON(url, (err, repos) => {
      //to repos anaferetai sto xhr.response
      //olo ayto einai meros ths cb(callback function)
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          text: err.message,
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);

      repos.forEach(repo => renderRepoDetails(repo, ul));

      repos.sort(function(a, b) {
        return a['name'].toUpperCase() > b['name'].toUpperCase()
          ? 1
          : b['name'].toUpperCase() > a['name'].toUpperCase()
          ? -1
          : 0;
      });
      for (let i = 0; i < 10; i++) {
        console.log(`Name : ${repos[i]['name']}`);
        console.log(`Description : ${repos[i]['description']}`);
        console.log(`Forks : ${repos[i]['forks']}`);
        console.log(`Updated at : ${repos[i]['updated_at']}`);
      }
    });
  }

  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  window.onload = () => main(HYF_REPOS_URL);
}
