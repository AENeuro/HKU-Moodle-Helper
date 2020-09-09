// Note: every element that is to be removed during a clearing session 
// should be marked with a "helper-extension" classname
// Otherwise it should be marked with "helper-extension-persistent"

// Code splitting was done through globalThis (which was confined within ContentScript. Thus no pollutions were made)
mainFunction()

async function mainFunction() {
  await addCourseOfSem()
}

async function addCourseOfSem() {
  courseHTML = new Array()
  const { courseIDs } = await browser.storage.sync.get({'courseIDs': []})

  clearAll()
  var courses = document.getElementsByClassName("coursebox")
  for (var i = 0; i < courses.length; i++) {
    currentCourseID = courses[i].dataset.courseid
    var included = false
    if (courseIDs){ included = courseIDs.includes(currentCourseID) }
    if (included) {
      //如果在列表中
      //复制element，存入数组
      courseHTML.push(courses[i].cloneNode(true))

      // Applies to all courses on the page that is in the list (in "my courses" section)
      courses[i].lastChild.lastChild.insertAdjacentHTML('beforebegin', `
        <button class="helper-extension helper-remove-button" id="removeCourse${currentCourseID}">
          Remove from this semester
        </button>
      `)
      document.getElementById("removeCourse" + currentCourseID).addEventListener("click",function(e){
        removeCourse(e.target.id.slice(12), courseIDs)
      })
    } else {

      // Applies to all courses on the page that is not in the list (in "my courses" section)
      courses[i].lastChild.lastChild.insertAdjacentHTML('beforebegin',`
        <button class="helper-extension helper-add-button" id="addCourse${currentCourseID}">
          Add to this semester
        </button>
      `)
      document.getElementById("addCourse" + currentCourseID).addEventListener("click",function(e){
        addCourse(e.target.id.slice(9), courseIDs)
      })
    }
  }


  var outerContainer = document.getElementById("frontpage-course-list")

  if (courseIDs && courseIDs.length){
    //如果有课程
    outerContainer.insertAdjacentHTML('afterbegin', `
      <div class="helper-extension">
        <h2>
          Course of this semester
          <div id="removeAll">×</button>
        </h2>
        <div id="courseOfSem" class="courses frontpage-course-list-enrolled has-pre has-post course-of-sem"></div>
      </div>
    `)

    document.getElementById("removeAll").addEventListener("click", function(){
      if (confirm("Sure you wanna remove all courses from this semester?")){
        removeAll()
      }
    })
  } else {
    //没有课程
    outerContainer.insertAdjacentHTML('afterbegin', `
      <div class="helper-extension">
        <h2>Course of this semester</h2>
        <p><i>Please click 'Add to this semester' on a course to bring it here.</i></p>
      </div>
    `)
  }
  

  var innerContainer = document.getElementById("courseOfSem")
  for (var i = 0; i < courseHTML.length; i++) {
    if (i%2) {
      //注意这里是偶数 => 这里是不能整除2（i是奇数），但是在显示顺序上是“偶数”
      courseHTML[i].className = "coursebox clearfix even"
    }else{
      courseHTML[i].className = "coursebox clearfix odd"
    }

    // applies to all courses in this semester (in "course of this semester" section)
    currentCourseID = courseHTML[i].dataset.courseid
    courseHTML[i].insertAdjacentHTML('afterbegin', `
      <a id="removeCourseA${currentCourseID}" style="position: absolute; top: 5px; right: 5px; font-size: 25px; color: darkgrey; cursor: pointer">
        ×
      </a>
    `)
    innerContainer.appendChild(courseHTML[i])
    document.getElementById("removeCourseA" + currentCourseID).addEventListener("click",function(e){
      removeCourse(e.target.id.slice(13), courseIDs)
    })
  }
}

// ======================================
// Helper functions

function clearAll() {
  var clearElements = document.getElementsByClassName("helper-extension")
  //必须倒序删除，因为HTMLCollection会因为remove方法动态变化
  for (var i = clearElements.length - 1; i >= 0; --i) {
    clearElements[i].remove()
  }
}

async function addCourse(courseCode, courseIDs) {
  if (courseIDs && courseIDs.length){
    courseIDs.push(courseCode)
  }else{
    courseIDs=[courseCode]
  }
  await browser.storage.sync.set({courseIDs: courseIDs})
  
  mainFunction()
}

async function removeCourse(courseCode, courseIDs) {
  courseIDs = courseIDs.filter(function(value, index, arr){
    return value !== courseCode;
  });
  await browser.storage.sync.set({courseIDs: courseIDs})
  
  mainFunction()
}

async function removeAll() {
  browser.storage.sync.set({courseIDs: null})

  mainFunction()
}