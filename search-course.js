// How this works
// set coursebox as display:none, otherwise "revert"
init()

function init() {
  // First <h2> is "Course of this sem", second one is "My courses"
  // But we cannot make sure that async function returns before every thing is done
  var h2Els = document.getElementsByTagName("h2")
  for(var i = 0; i < h2Els.length; i++) {
    if(h2Els[i].innerHTML === "My courses") {
      var myCoursesTitleEl = h2Els[i]
      break
    }
  }

  myCoursesTitleEl.classList.add("my-courses-title")

  myCoursesTitleEl.insertAdjacentHTML('afterend', `
    <input 
      class="helper-extension-persistent" id="helper-search" type="text" 
      autofocus="true" placeholder="Search for a Course"
    />
  `)

  var searchBox = document.getElementById("helper-search")
  searchBox.addEventListener("input", onSearch)

  document.getElementsByClassName("coursesearchbox")[0].firstChild.innerHTML = "Search all courses in HKU:"
}


function onSearch(e) {
  var searchTerm = e.target.value.toLowerCase()
  var enrolledCourses = document.getElementsByClassName("frontpage-course-list-enrolled")[0].children
  
  // HTMLCollections are not arrays, forgive me for this usage
  // Yes using JQuery would be significantly easier, but it's also risky
  Array.prototype.forEach.call(enrolledCourses, (el) => {
    if(el.classList.contains("coursebox")) {
        
      var courseName = el.getElementsByClassName("coursename")[0].firstChild.innerHTML.toLowerCase()
      
      if(courseName.includes(searchTerm)) {
        el.classList.remove("helper-search-hide")
        el.classList.add("helper-search-show")
      } else {
        el.classList.remove("helper-search-show")
        el.classList.add("helper-search-hide")
      }
    }
  }) 
}