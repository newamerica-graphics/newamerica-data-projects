# NA Data Projects

Primary repository for New America's data visualization projects

## Getting Started

1. clone repo
2. run ``` npm install ```

## Creating a New Project

#### Initializing the Project
1. Create a new folder within the src/js/projects directory titled with the project_id (no spaces/capital letters)
2. Create an index.js file within this new folder.  index.js must contain:
    * variables definitions array (see spec below)
    * vizSettings object (see spec below)
    * ``` setupProject(projectSettings) ```

#### Development

1. to create a dev build of the project run ``` npm run dev --project=<project_id> ``` 
(where project id is the title given to the folder in step 1) 
    * You should now see a file in the local build directory entitled project_id.js
    * leave this command running, as it will watch for any changes you make to the project and update the bundle in your local build directory
    
#### Creating a Production Build
1. to create a production build of the project run ``` npm run build --project=<project_id> ```
    * this will upload a copy of the bundled script to new america's data project s3 bucket, which will then be able to be included as an external script in any post content on the New America site  
    
#### Integrating Bundled Project Script with New America Site
1. Create a new In Depth Project, Blog Post, Article, Podcast, Policy Paper, etc. in the Wagtail editor
2. Go to the settings tab for the page you just created and add the name of the script (project_id.js) to the DATA PROJECT EXTERNAL SCRIPT field
3. Add dataviz blocks to the post, with the corresponding dataviz id for each visualization



## Spec for Integration with Wagtail Templating Backend

The bundled script for a given project will instantiate a viz controller class object for the project.  This viz controller has the following public methods:


##### initialize({dataUrl, clickToProfileFunction})

##### getData()
##### render(dataVizId)
##### reset()
##### resize()

