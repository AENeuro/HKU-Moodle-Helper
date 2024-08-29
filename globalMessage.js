//The duration is unit of ms!!
globalThis.globalMessage = function (content, duration, type) {
  const icon = {
    success:
      '<svg t="1627298140320" class="success" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5758" width="32" height="32"><path d="M512 1024C229.2352 1024 0 794.7648 0 512S229.2352 0 512 0s512 229.2352 512 512-229.2352 512-512 512z m271.5264-653.7088l-54.2976-54.3104-307.7376 307.7376-126.72-126.72-54.2976 54.3104L385.28 696.128l36.1984 36.1984z" fill="#07c160" p-id="5759"></path></svg>',
    error:
      '<svg t="1627298268609" class="error" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7917" width="32" height="32"><path d="M512 0A512 512 0 1 0 1024 512 512 512 0 0 0 512 0z m209.204301 669.673978a36.555699 36.555699 0 0 1-51.750538 51.640431L511.779785 563.64043 353.995699 719.662796a36.555699 36.555699 0 1 1-52.301075-51.089893 3.303226 3.303226 0 0 1 0.88086-0.88086L460.249462 511.779785l-157.013333-157.453763a36.665806 36.665806 0 1 1 48.777634-55.053764 37.876989 37.876989 0 0 1 2.972904 2.972903l157.233548 158.114409 157.784086-156.132473a36.555699 36.555699 0 0 1 51.420215 52.08086L563.750538 512.220215l157.013333 157.453763z" fill="#fa5151" p-id="7918"></path></svg>',
    info: '<svg t="1627359095099" class="info" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4258" width="2rem" height="2rem"><path d="M983.838803 313.362669A511.938806 511.938806 0 1 0 1023.96018 512.035755a508.619448 508.619448 0 0 0-40.121377-198.673086zM561.712074 796.404116c0 21.929697-21.540943 39.662847-48.115749 39.662847s-48.115749-17.763054-48.115748-39.662847V409.494486c0-21.929697 21.540943-39.662847 48.115748-39.662847s48.115749 17.763054 48.115749 39.662847zM513.596325 305.607531a58.81146 58.81146 0 1 1 58.81146-58.81146 58.81146 58.81146 0 0 1-58.81146 58.81146z" p-id="4259" fill="#10aeff"></path></svg>',
    warning:
      '<svg t="1627298339421" class="warning" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9679" width="32" height="32"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512-230.4-512-512-512z m-51.2 281.6c0-25.6 25.6-51.2 51.2-51.2s51.2 25.6 51.2 51.2v281.6c0 25.6-25.6 51.2-51.2 51.2s-51.2-25.6-51.2-51.2V281.6z m51.2 512c-32 0-57.6-25.6-57.6-57.6s25.6-57.6 57.6-57.6 57.6 25.6 57.6 57.6-25.6 57.6-57.6 57.6z" fill="#ffc300" p-id="9680"></path></svg>',
  };
  const html = `
    <div class="overlay">
        <div class="message-list">
        <div class="message-item fade-in" >
        <div>
        <span class="icon">${icon[type]}</span>
            
            <span class="text">${content}</span>
            <a id="removeMessage" style="margin-bottom: auto; margin-left: auto; font-size: 20px; color: #C0C0C0; cursor: pointer">
        ×
      </a>
        </div>
    </div>
        </div>
    </div>
        `;

    const wrapperElement = document.querySelector("#page-wrapper-outer");
    console.log(wrapperElement.target)
    if (wrapperElement) {
      wrapperElement.insertAdjacentHTML('afterbegin', html);
    }
    const message = document.querySelectorAll("div.message-item")[0];
    document
      .getElementById("removeMessage")
      .addEventListener("click", function () {
        message.classList.add("fade-out")
        message.addEventListener("animationend", function(){
          document.querySelector("#page-wrapper-outer > div.overlay").remove()
      })
      });
};
