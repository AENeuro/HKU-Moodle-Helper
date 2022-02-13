globalThis.addQRCode = async function() {
  //get unique all courseCode array
  //query for all links
  //add QR overlay to all 
  //add QR upload button to all 

  let allCoursesOnScreen = getAllCoursesID()
  let imgLinks = await getAllQRCode(allCoursesOnScreen)
  addPopUp(imgLinks)
}

getAllCoursesID = () => {
  var courses = Array.from(document.getElementsByClassName("coursebox")) //get all courses and convert into array (for mapping)
  var courseIDs = courses.map((el) => (el.dataset.courseid))
  courseIDs = courseIDs.filter((value, index, self) => self.indexOf(value) === index) //get unique
  return(courseIDs)
}

getAllQRCode = async (courses) => {
  // TODO: Allow async request later
  return(courses.map(id => (
    {
      id: id,
      img: [{
        img: "https://source.unsplash.com/1000x800/",
        sub: "1A",
        description: "Chinese speaker only",
      }]
    })))
}

addPopUp = (imgLinks) => {
  var courses = document.getElementsByClassName("coursebox")
  for (var course of courses) {
    id = course.dataset.courseid
    course.insertAdjacentHTML("afterbegin",generatePopUpHTML(imgLinks.find(el => el.id === id)))
  }
}


generatePopUpHTML = ({id, img}) => {
  console.log(id)
  console.log(img)
  return(`
    <a 
      tabindex="0" 
      role="button"
      class="helper-extension"
      data-animation=true
      data-toggle="popover" 
      data-trigger="focus"
      data-container="body"
      title="Dismissible popover" 
      data-content="And here's some amazing content. It's very engaging. Right?"
    >
      <div style="position: absolute; bottom: 45px; right: 5px; font-size: 13px; color: darkgrey; cursor: pointer">
        <i class="fas fa-qrcode" style="margin-right: 4px"></i>MeetUp/约课
      </div>
    </a>
  `)

}
