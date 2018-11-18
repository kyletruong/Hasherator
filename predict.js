function predict_click(value, source) {
  var index = document.getElementById("hidden-counter").value;

  if(index > 1) {
    createNewDisplayDiv(index);
  }
  
  if(source === "url") {
    document.getElementById("img_preview" + index).src = value;
    doPredict({ url: value });
    
    
    createHiddenDivs("url", value);
  }
    
  else if(source === "file") {
    var preview = document.querySelector("#img_preview" + index);
    var file    = document.querySelector("input[type=file]").files[0];
    var reader  = new FileReader();

    
    reader.addEventListener("load", function () {
      preview.src = reader.result;
      var localBase64 = reader.result.split("base64,")[1];
      doPredict({ base64: localBase64 });
    
      createHiddenDivs("base64", localBase64);
        
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  } 
}

function doPredict(value) {

  var modelID = getSelectedModel();

  app.models.predict(modelID, value).then(
    
    function(response) {
      console.log(response);
      var conceptNames = "";
      var tagArray, regionArray;
      var tagCount = 0;
      var modelName = response.rawData.outputs[0].model.name;
      var modelHeader = '<b><span style="font-size:14px">' + 'Concepts</span></b>';
    
      if (response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
        tagArray = response.rawData.outputs[0].data.concepts;
        
        for (var other = 0; other < tagArray.length; other++) {
          conceptNames += '<li>' + tagArray[other].name;
        }
        
        tagCount=tagArray.length;
      }
      
      var columnCount = tagCount / 10;
      
      conceptNames = '<ul style="margin-right:20px; margin-top:20px; columns:' + columnCount + '; -webkit-columns:' + columnCount + '; -moz-columns:' + columnCount + ';">' + conceptNames;
        
      conceptNames += '</ul>';
      conceptNames = modelHeader + conceptNames;
      
      $('#concepts').html(conceptNames);
      
      document.getElementById("add-image-button").style.visibility = "visible";
    },
    function(err) {
      console.log(err);
    }
  );
}

function getSelectedModel() {
  return Clarifai.GENERAL_MODEL;
}

function createNewDisplayDiv(index) {
  var mainDiv = document.getElementById("predictions");
  
  var elem = document.createElement('div');
  elem.innerHTML = 
    '<div style="margin-top:30px; margin-left:20px; margin-bottom:30px; clear:left; float:left"> \
      <img id="img_preview' + index + '" src="" width="400"/> \
      <br/> \
            \
    </div> \
    <div id="concepts" class="conceptBox"> \
    </div>';
    
  mainDiv.innerHTML = elem.innerHTML + mainDiv.innerHTML;
}

function createHiddenDivs(urlOrBase64, source) {
  var index = document.getElementById("hidden-counter").value;
  
  var input1 = document.createElement("input");
  input1.setAttribute("type", "hidden");
  input1.setAttribute("id", "hidden-type"+index);
  input1.setAttribute("name", "hidden-type"+index);
  input1.setAttribute("value", urlOrBase64);
  
  var input2 = document.createElement("input");
  input2.setAttribute("type", "hidden");
  input2.setAttribute("id", "hidden-val"+index);
  input2.setAttribute("name", "hidden-val"+index);
  input2.setAttribute("value", source);
  
  document.getElementsByTagName('body')[0].appendChild(input1);
  document.getElementsByTagName('body')[0].appendChild(input2);
  
  document.getElementById("hidden-counter").value = parseInt(index)+1;
}

function capitalize(s)
{
  return s[0].toUpperCase() + s.slice(1);
}
