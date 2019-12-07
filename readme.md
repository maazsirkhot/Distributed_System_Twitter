# Twitter

1. Download the project.  
2. Extract the zip file.
3. Start redis server by the command ```redis-server``` (redis has to be installed in your system and has to be running in its default port).
4. Go to the location where your package.json resides.  
5. Run the command "npm install".  
6. After all the dependencies get installed, run the command "npm start".

## Linting

1. ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

2. There are some more pre-defined style guidelines(Airbnb/Google).

3. How to set-up and start with eslint.
..* <https://hackernoon.com/a-simple-linter-setup-finally-d908877fa09>
⋅⋅* ```npm install eslint --save-dev``` (Installs eslint as a dev-dependancy).  
..* ```npx eslint --init``` (This asks you a set of questions to create a lint config file)(Using airbnb standard with react, requires you to install several more packages which eslint init itself suggests).  
..* ```npx eslint .``` (Does linting in the current directory).  
..* ```npx eslint . --fix``` (Thi gives an option to auto-fix some deviations).  
..* Create react app itself has built int eslint, so its doc tells not to install your version of lint as it may mess up the structure. (<https://stackoverflow.com/questions/49022912/failing-to-browse-react-application-deployed-to-heroku)>(<https://github.com/facebook/create-react-app/issues/3617)>  
..* eslint-nibble package helps us to run anayltics above the eslint base and is very useful.  
