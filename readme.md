# Twitter

1. Download the project.  
2. Extract the zip file.  
3. Go to the location where your package.json resides.  
4. Run the command "npm install".  
5. fter all the dependencies get installed, run the command "npm start".

## Lint

1. ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

2. There are some more pre-defined style guidelines(Airbnb/Google) that are available for React(Not for nodejs).

3. How to set-up and start with eslint.
⋅⋅* ```npm install eslint --save-dev``` (Installs eslint as a dev-dependancy).
..* ```npx eslint --init``` (This asks you a set of questions to create a lint config file)(Using airbnb standard with react, requires you to install several more packages which eslint init itself suggests).
..* ```npx eslint /Users/aswin-pc/Desktop/273-twitter/backend``` (Or use the directory for which you want to check the coding standards).
..* ```npx eslint /Users/aswin-pc/Desktop/273-twitter/backend --fix``` (This may give an option to auto-fix some deviations).
..* Create react app itself has built int eslint, so its doc tells not to install your version of lint as it may mess up the structure. (<https://stackoverflow.com/questions/49022912/failing-to-browse-react-application-deployed-to-heroku)>(<https://github.com/facebook/create-react-app/issues/3617)>
..* If the current setup doesnt work, use ^5.16 for eslint and remove eslint-loader
