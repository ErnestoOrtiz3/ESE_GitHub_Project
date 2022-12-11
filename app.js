import { verifiedActions } from './verifiedActions.mjs';
import { s1 } from './Data/s1.mjs';
import { s2 } from './Data/s2.mjs';
import { s3 } from './Data/s3.mjs';
import { s4 } from './Data/s4.mjs';
import { s5 } from './Data/s5.mjs';
import { s6 } from './Data/s6.mjs';
import { s7 } from './Data/s7.mjs';
import { s8 } from './Data/s8.mjs';
import { s9 } from './Data/s9.mjs';
import { s10 } from './Data/s10.mjs';
import { s11 } from './Data/s11.mjs';
import { s12 } from './Data/s12.mjs';
import { s13 } from './Data/s13.mjs';
import { s14 } from './Data/s14.mjs';
import { s15 } from './Data/s15.mjs';
import { s16 } from './Data/s16.mjs';
import { s17 } from './Data/s17.mjs';
import { s18 } from './Data/s18.mjs';
import { s19 } from './Data/s19.mjs';
import { s20 } from './Data/s20.mjs';
import { s21 } from './Data/s21.mjs';
import { s22 } from './Data/s22.mjs';
import { s23 } from './Data/s23.mjs';
import { s24 } from './Data/s24.mjs';
import { s25 } from './Data/s25.mjs';
import { s26 } from './Data/s26.mjs';
import { s27 } from './Data/s27.mjs';
import { s28 } from './Data/s28.mjs';
import { s29 } from './Data/s29.mjs';
import { s30 } from './Data/s30.mjs';
import { s31 } from './Data/s31.mjs';
import { s32 } from './Data/s32.mjs';
import { s33 } from './Data/s33.mjs';
import { s34 } from './Data/s34.mjs';
import { s35 } from './Data/s35.mjs';
import { s36 } from './Data/s36.mjs';
import { s37 } from './Data/s37.mjs';
import { s38 } from './Data/s38.mjs';
import { s39 } from './Data/s39.mjs';
import { s40 } from './Data/s40.mjs';
import { s41 } from './Data/s41.mjs';
import { s42 } from './Data/s42.mjs';
import { s43 } from './Data/s43.mjs';
import { s44 } from './Data/s44.mjs';
import { s45 } from './Data/s45.mjs';
import { s46 } from './Data/s46.mjs';
import { s47 } from './Data/s47.mjs';
import { s48 } from './Data/s48.mjs';
import { s49 } from './Data/s49.mjs';
import { s50 } from './Data/s50.mjs';
import { s51 } from './Data/s51.mjs';
import { s52 } from './Data/s52.mjs';
//To import, the extension of the json files was changed to mjs and 
//a type property was added to package.json with value module.


/* The file in the Data folder is an array of json objects. The json objects contain workflows
  that different GitHub project use. The file verifiedActions.mjs is an array that 
  contains all verified GitHub Actions as of November 26, 2022. The functions 
  lookup and type are used to find all the values for a given property on a given
  json object. We find all the actions that a project uses. Then, for each action that the
  project uses we check if it comes from a verified organization. If it doesn't, we check if
  the action is pinned to a specific commit in the action repository. We also check if the 
  project has set the permissions for the GITHUB_TOKEN globally, and whether a workflow runs commands
  use secrets. The program outputs the totals of these tests for the entire dataset  */

//This Array will store the values for the key provided to the lookup function
const values = [];
//Turn to true if you would like to see some of the output in the terminal while the program executes
const seeOutputInTerminal = false;

/* Functions lookup and type taken from: https://stackoverflow.com/questions/38805134/search-key-in-nested-complex-json*/
// Lookup was modified to return a list of values found for a given key in the given object
function lookup(obj, k) {
    for (var key in obj) {
      var value = obj[key];
  
      if (k == key) {
        values.push(value);
      }
  
      if (typeof(value) === "object" && !Array.isArray(value)) {
        var y = lookup(value, k);
        if (y && y[0] == k) return y;
      }
      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; ++i) {
          var x = lookup(value[i], k);
          if (x && x[0] == k) return x;
        }
      }
    }
    if(values.length != 0){
        return values;
    }
    else {
        return [];
    }
  }
  
  //Helper for function for the lookup function
  function type(object) {
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;
  
    if (object === null) {
      return "null";
    } else if (object === undefined) {
      return "undefined";
    } else if (object.constructor === stringConstructor) {
      return "String";
    } else if (object.constructor === arrayConstructor) {
      return "Array";
    } else if (object.constructor === objectConstructor) {
      return "Object";
    } else {
      return "null";
    }
  }

  var filesArray = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, 
    s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27,
    s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41,
    s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52];
  var projectActions = "";
  var tokenPermissions = "";
  var permissionsCount = 0;
  var projectsThatUseUnverifiedUnpinnedActions = 0;
  var usesSecrets = "";
  var unpinnedAndSecretsecrets = 0;
  var lock = true;
  var posibleInjection = 0;
  var injectionLock = true;
  var lockPermissions = true;
  var readWithSecrets = "";
  var readAndSecretsLock = true;
  var readWithSecretsCount = 0;
  function verifyActions(){
    for (let idx = 0; idx < filesArray.length; idx++){
      for (let i = 0; i < filesArray[idx].length; i++){
        //For each project in every set, we get a list of the actions that it uses
        projectActions = lookup(filesArray[idx][i], 'uses');
     
        //For each action that a project uses, check if it is on the verified actions list
        for(let j = 0; j < projectActions.length; j++){
          let action = projectActions[j];
          if(typeof(action) == 'string'){
          let actionName = action.split("@");

          //If the action does not come for a verified org, we check if the project pins the action to a commit.
          if(!verifiedActions.includes(actionName[0])){
            if(seeOutputInTerminal){
              console.log("project number ", i, " unverified action       ", action);
            }
          
            if (actionName.length > 1){
              if (isNaN(actionName[1][0]) || actionName[1][1] == "."){
                if(seeOutputInTerminal){
                  console.log("The unverified action is not pinned");
                  console.log("");
                }
              
                //Check if the project has permissions set for the GITHUB_TOKEN
                tokenPermissions = lookup(filesArray[idx][i], 'permissions');
                  for (let m = 0; m < tokenPermissions.length; m++){
                    if(typeof tokenPermissions[m] === 'string'){
                      var result2 = tokenPermissions[m].includes("read-all");
                      if(result2 && lockPermissions){
                        lockPermissions = false;
                        permissionsCount = permissionsCount + 1;
                        
                        //Check if the project with permisisons set uses secrets
                        readWithSecrets = lookup(filesArray[idx][i], 'run');
                        for (let m = 0; m < readWithSecrets.length; m++){
                          if(typeof readWithSecrets[m] === 'string'){
                            var result3 = readWithSecrets[m].includes("secrets.");
                            if(result3 && readAndSecretsLock){
                              readAndSecretsLock = false;
                              readWithSecretsCount = readWithSecretsCount + 1;
                            }
                          }
                        }
                        for(let k = 0; k < readWithSecrets.length; k++){
                          readWithSecrets.pop();
                        }
                      } 
                    }
                  }
                for(let k = 0; k < tokenPermissions.length; k++){
                  tokenPermissions.pop();
                }

                //Check if project without permissions set for the GITHUB_TOKEN is using secrets
                usesSecrets = lookup(filesArray[idx][i], 'run');
                for (let m = 0; m < usesSecrets.length; m++){
                  if(typeof usesSecrets[m] === 'string'){
                    var result = usesSecrets[m].includes("secrets.");
                    if(result && lock){
                      lock = false;
                      unpinnedAndSecretsecrets = unpinnedAndSecretsecrets + 1;
                    }
                    var injection = usesSecrets[m].includes("events.title");
                    if(injection && injectionLock){
                      injectionLock = false;
                      posibleInjection = posibleInjection + 1;
                    }
                  }
                }
                for(let k = 0; k < usesSecrets.length; k++){
                  usesSecrets.pop();
                }
                lock = true;
                injectionLock = true;
                lockPermissions = true;
                readAndSecretsLock = true;

              projectsThatUseUnverifiedUnpinnedActions = projectsThatUseUnverifiedUnpinnedActions + 1;
              break;
            }
            else{
              if(seeOutputInTerminal){
                console.log("The unverified action is pinned")
                console.log("");
              } 
            }
          }
        }
        else{
          if(seeOutputInTerminal){
            console.log("project number ", i, " verified action   ", action);
          }
        }
      }
    }
      //Empty projectActions to ready for next project
      for(let k = 0; k < projectActions.length; k++){
        projectActions.pop();
      }
    }
  }
  }

  verifyActions();
  console.log("projectsThatUseUnverifiedUnpinnedActions", projectsThatUseUnverifiedUnpinnedActions);
  console.log("PermissionsCount   ", permissionsCount);
  console.log("UnpinnedAndSecrets", unpinnedAndSecretsecrets);
  console.log("Possible injection   ", posibleInjection);
  console.log("ReadWithSecretsCount", readWithSecretsCount);