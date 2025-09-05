// Note: every element that is to be removed during a clearing session
// should be marked with a "helper-extension" classname
// Otherwise it should be marked with "helper-extension-persistent"

const FONT_AWESOME_CSS = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
const COURSE_VIEW_PATH = "/course/view.php";
const COURSE_SEARCH_PATH = "/course/search.php";
const MOODLE_HKU_HOMEPAGE = "https://moodle.hku.hk/";

mainFunction();

async function mainFunction() {
  initializePage();
}

async function initializePage() {
  await addCssByLink(FONT_AWESOME_CSS);
  
  if(window.location.pathname === COURSE_VIEW_PATH) { 
    return;
  }
  
  await addCourseOfSem();
  if (window.location.href == MOODLE_HKU_HOMEPAGE) {
    globalThis.addFeedbackBox();
    globalThis.addMessageBox();
  }
}

async function addCourseOfSem() {
  courseElements = new Array();
  const { courseList, version} = await browser.storage.sync.get({ courseList: [], version: 1});
  clearAll();
  var courses = document.getElementsByClassName("coursebox");
  pagePath = window.location.pathname;
  if (version == 1){
    globalThis.globalMessage("This is HKU Moodle Helper Ver. 1.4.8 !  Now supports the updated Moodle; you may also add courses from search page!", 10000, 'info');
    await browser.storage.sync.set({version: 2})
  }
  for (var i = 0; i < courses.length; i++) {
    const currentCourseID = courses[i].dataset.courseid;
    var included = false;
    if (courseList) {
      included = courseList
        .map((value, index, array) => {
          return value.courseID;
        })
        .includes(currentCourseID);
    }
    if (included) {
      //如果在列表中
      //复制element，存入数组
      if (pagePath != COURSE_SEARCH_PATH) {
        courseElements.push({
          courseID: currentCourseID,
          courseHTML: courses[i].cloneNode(true),
        });
      }

      // Applies to all courses on the page that is in the list (in "my courses" section)
      courses[i].lastChild.lastChild.insertAdjacentHTML(
        "afterbegin",
        `
        <button class="btn btn-secondary helper-extension helper-remove-button" id="removeCourse${currentCourseID}">
          Remove from this semester
        </button>
      `
      );
      document
        .getElementById("removeCourse" + currentCourseID)
        .addEventListener("click", function (e) {
          removeCourse(e.target.id.slice(12), courseList);
        });
    } else {
      // Applies to all courses on the page that is not in the list (in "my courses" section)
      courses[i].lastChild.lastChild.insertAdjacentHTML(
        "afterbegin",
        `
        <button class="btn btn-secondary helper-extension helper-add-button" id="addCourse${currentCourseID}" >
          Add to this semester
        </button>
      `
      );
      document
        .getElementById("addCourse" + currentCourseID)
        .addEventListener("click", function (e) {
          courseInfo = extractInfo(LocateCourse(currentCourseID, courses));
          if (pagePath == COURSE_SEARCH_PATH)
            addCourse(pagePath, e.target.id.slice(9), courseList, courseInfo);
          else addCourse(pagePath, e.target.id.slice(9), courseList);
        });
    }
  }
  // addcourses buttons for side bars

  var sidebarlist = document.getElementsByClassName("column c1");
  for (var i = 0; i < sidebarlist.length; i++) {
    //  id comes from the ref: https://moodle.hku.hk/course/view.php?id=xxx
    var included = false;
    const id = sidebarlist[i].firstChild.href.slice(41);
    if (courseList) {
      included = courseList
        .map((value, index, array) => {
          return value.courseID;
        })
        .includes(id);
    }
    const text = sidebarlist[i].removeChild(sidebarlist[i].lastChild);
    const anchor = document.createElement("span");
    sidebarlist[i].appendChild(anchor);
    sidebarlist[i].firstChild.insertAdjacentHTML(
      "afterEnd",
      `<div class="helper-extension helper-sidebar-wrapper">
          <div class="helper-extension helper-sidebar-button-${
            included ? "minus" : "plus"
          }" id="sidebarbtn${id}" title='${
        included ? "remove from" : "add to"
      } this semester' >${included ? "×" : "+"}</div>
        </div>`
    );
    sidebarlist[i].removeChild(anchor);
    sidebarlist[i].lastChild.insertAdjacentElement("beforeBegin", text);

    if (included) {
      document
        .getElementById("sidebarbtn" + id)
        .addEventListener("click", function (e) {
          removeCourse(e.target.id.slice(10), courseList);
        });
    } else {
      document
        .getElementById("sidebarbtn" + id)
        .addEventListener("click", function (e) {
          addCourse(COURSE_SEARCH_PATH, e.target.id.slice(10), courseList, {
            title: text.innerText,
            teachers: "",
          });
        });
    }
  }

  // if the current page is NOT the homepage, stop executing the following homepage-related code
  if(window.location.href != MOODLE_HKU_HOMEPAGE) { return; }

  var outerContainer = document.getElementById("frontpage-course-list");

  if (courseList && courseList.length && outerContainer) {
    //如果有课程
    outerContainer.insertAdjacentHTML(
      "afterBegin",
      `
      <div class="helper-extension course-of-sem-wrapper">
        <h2>
          Course of this semester
          <div id="removeAll">×</button>
        </h2>
        <div id="courseOfSem" class="courses frontpage-course-list-enrolled has-pre has-post course-of-sem"></div>
      </div>
    `
    );

    document.getElementById("removeAll").addEventListener("click", function () {
      if (confirm("Do you wish to remove all courses from this semester?")) {
        removeAll();
      }
    });
  } else {
    //没有课程
    outerContainer.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="helper-extension course-of-sem-wrapper">
        <h2>Course of this semester</h2>
        <p><i>Please click 'Add to this semester' on a course to bring it here.</i></p>
      </div>
    `
    );
  }
  if(!courseList) { return; }
  var innerContainer = document.getElementById("courseOfSem");
  for (var i = 0; i < courseList.length; i++) {
    /* if (i % 2) {
      //注意这里是偶数 => 这里是不能整除2（i是奇数），但是在显示顺序上是“偶数”
      courseHTML[i].className = "coursebox clearfix even";
    } else {
      courseHTML[i].className = "coursebox clearfix odd";
    } */
    // applies to all courses in this semester (in "course of this semester" section)
    currentCourseID = courseList[i].courseID;
    if (
      courseElements
        .map((value, index, array) => {
          return value.courseID;
        })
        .includes(courseList[i].courseID)
    ) {
      currentCourseHTML = courseElements.filter((value, index) => {
        return value.courseID == currentCourseID;
      })[0].courseHTML;
      currentCourseHTML.insertAdjacentHTML(
        "afterbegin",
        `
      <a id="removeCourseA${currentCourseID}" style="position: absolute; top: 5px; right: 5px; font-size: 25px; color: darkgrey; cursor: pointer">
        ×
      </a>
    `
      );
      innerContainer.appendChild(currentCourseHTML);
      document
        .getElementById("removeCourseA" + currentCourseID)
        .addEventListener("click", function (e) {
          removeCourse(e.target.id.slice(13), courseList);
        });
    } else {
      let courseDoc = new DOMParser().parseFromString(
        createCard(courseList[i]),
        "text/html"
      );
      var courseElement = courseDoc.querySelector("div");
      courseElement.insertAdjacentHTML(
        "afterbegin",
        `
      <a id="removeCourseA${currentCourseID}" style="position: absolute; top: 5px; right: 5px; font-size: 25px; color: darkgrey; cursor: pointer">
        ×
      </a>
    `
      );
      innerContainer.appendChild(courseElement);
      document
        .getElementById("removeCourseA" + currentCourseID)
        .addEventListener("click", function (e) {
          removeCourse(e.target.id.slice(13), courseList);
        });
    }
  }
}
// ======================================
// Helper functions
function addCssByLink(url) {
  var doc = document;

  var link = doc.createElement("link");

  link.setAttribute("rel", "stylesheet");

  link.setAttribute("href", url);

  var heads = doc.getElementsByTagName("head");

  if (heads.length) heads[0].appendChild(link);
  else doc.documentElement.appendChild(link);
}
function clearAll() {
  var clearElements = document.getElementsByClassName("helper-extension");
  //必须倒序删除，因为HTMLCollection会因为remove方法动态变化
  for (var i = clearElements.length - 1; i >= 0; --i) {
    clearElements[i].remove();
  }
}

function createCard(course) {
  courseID = course.courseID;
  courseInfo = course.courseInfo;
  return `<div class="coursebox clearfix odd first" data-courseid=${courseID} data-type="1">
    <div class="info">
      <h3 class="coursename">
        <a class="aalink" href="https://moodle.hku.hk/course/view.php?id=${courseID}">
          <span class="highlight">${courseInfo.title}</span>
        </a>
      </h3>
      <div class="moreinfo"></div>
    </div>
    <div class="content">
    <div class="summary">
      <h3 class="coursename">
        <a style="display: inline" href="https://moodle.hku.hk/course/view.php?id=${courseID}">${courseInfo.title}</a>
        <div class='history'>
          <div class="bubble" style="background-color: #332d2d;">
            <i style="width: 0px;height: 0px;color: #332d2d;border-width: 14px 15px 8px 0px;border-style: solid;border-color: currentcolor transparent transparent;top: 95%;left: 0px;margin-bottom: 4px;">
            </i>
            <div class="text">This course card was constructed based on your last visit to the search page or the sidebar</div>
          </div>
          <i class="fa fa-history history-icon" ></i>
        </div>
      </h3>
      <div></div>
    </div>
      <div class="teachers" >
      Teachers: 
      <a style="color: #966b00;">${courseInfo.teachers}</a>
      </div>
      <div class="course-btn">
        <p>
          <a
            class="btn btn-primary"
            href="https://moodle.hku.hk/course/view.php?id=${courseID}"
          >
            Click to enter this course
          </a>
        </p>
      </div>
    </div>
  </div>`;
}

function LocateCourse(courseID, courses) {
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].dataset.courseid == courseID) return courses[i];
  }
  return;
}

function extractInfo(courseElement) {
  title = courseElement.querySelector(".coursename").innerText;
  teachers = courseElement.querySelector(".teachers").innerText.slice(9);
  return { title: title, teachers: teachers };
}

async function addCourse(pageURL, courseID, courseList, courseInfo = {}) {
  if (pageURL == COURSE_SEARCH_PATH) {
    if (courseList && courseList.length) {
      courseList.push({ courseID: courseID, courseInfo: courseInfo });
    } else {
      courseList = [{ courseID: courseID, courseInfo: courseInfo }];
    }
    await browser.storage.sync.set({ courseList: courseList });
  } else {
    if (courseList && courseList.length) {
      courseList.push({ courseID: courseID });
    } else {
      courseList = [{ courseID: courseID }];
    }
    await browser.storage.sync.set({ courseList: courseList });
  }
  mainFunction();
}

async function removeCourse(courseCode, courseList) {
  courseList = courseList.filter(function (value, index, arr) {
    return value.courseID !== courseCode;
  });
  await browser.storage.sync.set({ courseList: courseList });

  mainFunction();
}

async function removeAll() {
  browser.storage.sync.set({ courseList: null });
  mainFunction();
}
