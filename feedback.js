globalThis.addFeedbackBox = function() {
  function showTextArea() {
    document.getElementById("helperFeedbackForm").classList.add("helper-shown")
    document.getElementById("helperFeedbackButton").insertAdjacentHTML("beforebegin", `
      <p id="helperFeedbackButton2" style="color: #AAAAAA;">You can also submit an issue or PR on 
        <a href="https://github.com/AENeuro/HKU-Moodle-Helper" target="_blank">
          <span style="color: #AAAAAA;"><u>Github</u></span>
        </a>
      </p>
    `)
    document.getElementById("helperFeedbackButton").remove()
  }
  
  async function sendFeedback() {
    document.getElementById("helperFeedbackSend").disabled = true
    try{
      await request({
        url: "	https://j8n6ydl8hd.execute-api.ap-southeast-1.amazonaws.com/create",
        method: "POST",
        body: document.getElementById("helperFeedbackInput").value
      })
    } catch(e) {
      alert("Network error")
    }
    document.getElementById("helperFeedbackForm").classList.remove("helper-shown")
    document.getElementById("helperFeedbackForm").insertAdjacentHTML("beforebegin", `
      <p style="color: #AAAAAA">Thank you for your feedback!</p>
    `)
    document.getElementById("helperFeedbackButton2").remove()
  }


  // initialization

  var version = chrome.runtime.getManifest().version
  document.getElementsByClassName("course-of-sem-wrapper")[0].insertAdjacentHTML("beforeend",`
    <div class="helper-feedback">
      <p>Powered by HKU Moodle Helper ver. ${version}</p>
      <p id="helperFeedbackButton">Feedback</p>
      <div id="helperFeedbackForm" class="helper-hidden">
        <input id="helperFeedbackInput" type="text"/><br/>
        <button id="helperFeedbackSend">Send</button>
      </div>
    </div>
  `)
  document.getElementById("helperFeedbackButton").addEventListener("click", showTextArea)
  document.getElementById("helperFeedbackSend").addEventListener("click", sendFeedback)
}


const request = obj => {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(obj.method || "GET", obj.url);
      if (obj.headers) {
          Object.keys(obj.headers).forEach(key => {
              xhr.setRequestHeader(key, obj.headers[key]);
          });
      }
      xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
          } else {
              reject(xhr.statusText);
          }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(JSON.stringify(obj.body));
  });
};