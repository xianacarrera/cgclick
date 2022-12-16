function initImport() {
    document.getElementById('file_import').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
}
  
function handleFileLoad(event) {
    // console.log(event);
    localStorage.setItem('slides', event.target.result);
}

function readTextFile(file) {
    var allText;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                //alert(allText);
            }
        }
    }
    rawFile.send(null);
}

function selectSlides(slides) {
    localStorage.setItem('slides', JSON.stringify(slides));
    console.log("selectSlides(): local.Storage.getItem('slides') = ", localStorage.getItem("slides"));
}