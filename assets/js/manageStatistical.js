var analyticData;
var listCenter;
/////////
let chart_classActiveChar;
var chart_StudentChar = null;

const selectElement = document.getElementById("select-year-hs");
const selectElement2 = document.getElementById("select-year");
const currentYear = new Date().getFullYear();

for (let i = 2020; i <= 2100; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;

  // Nếu năm hiện tại, đánh dấu là selected
  if (i === currentYear) {
    option.selected = true;
  }

  selectElement.appendChild(option);
}

for (let i = 2020; i <= 2100; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;

  // Nếu năm hiện tại, đánh dấu là selected
  if (i === currentYear) {
    option.selected = true;
  }

  selectElement2.appendChild(option);
}

//

var aggregatedData = {};
var classData;
var StudentResData;

const accessToken = localStorage.getItem("accessToken");

const store_ds_phuhuynh = localStorage.getItem("ds_phuhuynh");

var phuHuynhCoCon = 0;
var phuHuynhKhongCoCon = 0;
if (store_ds_phuhuynh) {
  ds_phuhuynh = JSON.parse(store_ds_phuhuynh);

  ds_phuhuynh.forEach((phuhuynh) => {
    if (phuhuynh.childs && phuhuynh.childs.length > 0) {
      phuHuynhCoCon++;
    } else {
      phuHuynhKhongCoCon++;
    }
  });
}

const store_analyticData = localStorage.getItem("analyticData");
if (store_analyticData) {
  analyticData = JSON.parse(store_analyticData);
  showUserNumber(
    analyticData.teacherNumber,
    analyticData.studentNumber,
    analyticData.parentNumber
  );

  showUserLink(
    analyticData.total.studentConnect.hocsinhlienket,
    analyticData.total.studentConnect.hocsinhkolienket,
    phuHuynhCoCon,
    phuHuynhKhongCoCon
  );
  showAge(analyticData.total.studentAges, analyticData.studentNumber);

  StudentResData = analyticData.total.studentJoinByMonth;

  showStudentRes(StudentResData, new Date().getFullYear());

  const totalJoinCount = analyticData.studentJoinAttendances.reduce(
    (total, center) => total + center.joinCount,
    0
  );
  const totalUnjoinCount = analyticData.studentJoinAttendances.reduce(
    (total, center) => total + center.unJoinCount,
    0
  );

  showAbsentChart(totalJoinCount, totalUnjoinCount);

  /// class

  // Lặp qua từng trung tâm
  analyticData.openClassByMonth.forEach((center) => {
    center.data.forEach((item) => {
      const key = `${item.year}-${item.month}`; // Tạo khóa cho từng tháng-năm

      // Nếu khóa chưa có trong aggregatedData, khởi tạo nó
      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          month: item.month,
          year: item.year,
          count: 0,
          closeCount: 0,
          openCount: 0,
        };
      }

      // Cộng dồn các giá trị
      aggregatedData[key].count += Number.isFinite(item.count) ? item.count : 0;
      aggregatedData[key].closeCount += Number.isFinite(item.closeCount)
        ? item.closeCount
        : 0;
      aggregatedData[key].openCount += Number.isFinite(item.openCount)
        ? item.openCount
        : 0;
    });
  });

  classData = Object.values(aggregatedData);

  showClass(classData, new Date().getFullYear());
}

listCenter = JSON.parse(localStorage.getItem("listCenter"));
fetchAnalytics();

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "flex";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

async function fetchAnalytics() {
  if (!analyticData) {
    showSpinner();
  }
  try {
    const res = await fetch(`${API_URL}/api/user-analytics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const resData = await res.json();
      console.log("resData", resData);
      analyticData = resData;

      localStorage.setItem("analyticData", JSON.stringify(analyticData));

      showUserNumber(
        analyticData.teacherNumber,
        analyticData.studentNumber,
        analyticData.parentNumber
      );

      showUserLink(
        analyticData.total.studentConnect.hocsinhlienket,
        analyticData.total.studentConnect.hocsinhkolienket,
        phuHuynhCoCon,
        phuHuynhKhongCoCon
      );

      showAge(analyticData.total.studentAges, analyticData.studentNumber);

      StudentResData = analyticData.total.studentJoinByMonth;

      showStudentRes(StudentResData, new Date().getFullYear());

      const totalJoinCount = analyticData.studentJoinAttendances.reduce(
        (total, center) => total + center.joinCount,
        0
      );
      const totalUnjoinCount = analyticData.studentJoinAttendances.reduce(
        (total, center) => total + center.unJoinCount,
        0
      );

      showAbsentChart(totalJoinCount, totalUnjoinCount);

      /// class

      // Lặp qua từng trung tâm
      analyticData.openClassByMonth.forEach((center) => {
        center.data.forEach((item) => {
          const key = `${item.year}-${item.month}`; // Tạo khóa cho từng tháng-năm

          // Nếu khóa chưa có trong aggregatedData, khởi tạo nó
          if (!aggregatedData[key]) {
            aggregatedData[key] = {
              month: item.month,
              year: item.year,
              count: 0,
              closeCount: 0,
              openCount: 0,
            };
          }

          // Cộng dồn các giá trị
          aggregatedData[key].count += Number.isFinite(item.count)
            ? item.count
            : 0;
          aggregatedData[key].closeCount += Number.isFinite(item.closeCount)
            ? item.closeCount
            : 0;
          aggregatedData[key].openCount += Number.isFinite(item.openCount)
            ? item.openCount
            : 0;
        });
      });

      classData = Object.values(aggregatedData);

      showClass(classData, new Date().getFullYear());

      hideSpinner();
    }
  } catch (error) {
    hideSpinner();
    console.log("fetchAnalytics error", error);
  }
}

fetchCenter();

async function fetchCenter() {
  fetch(`${API_URL}/api/centers?includeClass=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      listCenter = data.docs;

      console.log("listCenter", listCenter);

      var select1 = document.getElementById("select-center-1");
      var selectAge = document.getElementById("select-center-2");
      var selectSRegister = document.getElementById("select-center-3");
      var selectAbsent = document.getElementById("select-center-4");
      var selectClass = document.getElementById("select-center-5");

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        select1.appendChild(option);
      });

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        selectAge.appendChild(option);
      });

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        selectSRegister.appendChild(option);
      });

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        selectAbsent.appendChild(option);
      });

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        selectClass.appendChild(option);
      });

      const totalClassesByStatus = countClassesByStatus(listCenter);
      showClassData(totalClassesByStatus, "");
      localStorage.setItem("listCenter", JSON.stringify(listCenter));
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

//////////// function

function countClassesByStatus(data) {
  const statusCounts = {
    1: 0,
    2: 0,
    3: 0,
  };

  data.forEach((center) => {
    center.classes.forEach((classItem) => {
      // Kiểm tra trạng thái và tăng số lượng tương ứng
      if (statusCounts.hasOwnProperty(classItem.status)) {
        statusCounts[classItem.status]++;
      }
    });
  });

  return statusCounts;
}

function countClassesByStatusForCenter(data, centerId) {
  const statusCounts = {
    1: 0,
    2: 0,
    3: 0,
  };

  const center = data.find((center) => center.id == centerId);

  if (center) {
    center.classes.forEach((classItem) => {
      if (statusCounts.hasOwnProperty(classItem.status)) {
        statusCounts[classItem.status]++;
      }
    });
  } else {
    console.log(`Trung tâm với ID ${centerId} không tồn tại.`);
  }

  return statusCounts;
}

//so luong nguoi dung

var selectCenter1 = document.getElementById("select-center-1");

selectCenter1.addEventListener("change", function () {
  if (selectCenter1.value) {
    const filterData = analyticData.numberUserByCenter.filter(
      (item) => item.centerID == selectCenter1.value
    );
    showUserNumber(
      filterData[0].teacherNumber,
      filterData[0].studentNumber,
      filterData[0].parentNumber
    );

    const filterData2 = analyticData.studentConnect.filter(
      (item) => item.centerID == selectCenter1.value
    );

    showUserLink(
      filterData2[0].hocsinhlienket,
      filterData2[0].hocsinhkolienket,
      phuHuynhCoCon,
      phuHuynhKhongCoCon
    );
  } else {
    showUserNumber(
      analyticData.teacherNumber,
      analyticData.studentNumber,
      analyticData.parentNumber
    );

    showUserLink(
      analyticData.total.studentConnect.hocsinhlienket,
      analyticData.total.studentConnect.hocsinhkolienket,
      phuHuynhCoCon,
      phuHuynhKhongCoCon
    );
  }
});

function showUserNumber(teacherNumber, studentNumber, parentNumber) {
  document.querySelector("#countUserChart").innerHTML = "";
  var countUsertOptions = {
    chart: {
      type: "pie",
      height: 400,
    },
    series: [teacherNumber, studentNumber, parentNumber],
    labels: ["Giáo viên", "Học sinh", "Phụ huynh"],
  };

  // Tạo biểu đồ tròn
  var userCountChart = new ApexCharts(
    document.querySelector("#countUserChart"),
    countUsertOptions
  );
  userCountChart.render();
}

// so luong HS lien ket

// var countHSlkOptions = {
//   chart: {
//     type: "pie",
//     height: 250,
//   },
//   series: [
//     parseInt(countHSlk[0].SoHS),
//     parseInt(countHSlk[1].SoHS) - parseInt(countHSlk[0].SoHS),
//   ],
//   labels: ["Học sinh đã liên kết", "Học sinh chưa liên kết"],
//   colors: ["#FFA500", "#00FF00"],
// };

// new ApexCharts(
//   document.querySelector("#countHSlkChart"),
//   countHSlkOptions
// ).render();

function showUserLink(slinkNumber, snoLinkNumber, plinkNumber, pnoLinkNumber) {
  document.querySelector("#countHSlkChart").innerHTML = "";
  document.querySelector("#countPHlkChart").innerHTML = "";
  var countHSlkOptions = {
    chart: {
      type: "pie",
      height: 250,
    },
    series: [slinkNumber, snoLinkNumber],
    labels: ["Học sinh đã liên kết", "Học sinh chưa liên kết"],
    colors: ["#FFA500", "#00FF00"],
  };

  new ApexCharts(
    document.querySelector("#countHSlkChart"),
    countHSlkOptions
  ).render();

  var countPHlkOptions = {
    chart: {
      type: "pie",
      height: 250,
    },
    series: [plinkNumber, pnoLinkNumber],
    labels: ["Phụ huynh đã liên kết", "Phụ huynh chưa liên kết"],
    colors: ["#FFA500", "#00FF00"],
  };

  new ApexCharts(
    document.querySelector("#countPHlkChart"),
    countPHlkOptions
  ).render();
}

// so luong PH lien ket
// var countPHlkOptions = {
//   chart: {
//     type: "pie",
//     height: 250,
//   },
//   series: [
//     parseInt(countPHlk[0].SoPH),
//     parseInt(countPHlk[1].SoPH) - parseInt(countPHlk[0].SoPH),
//   ],
//   labels: ["Phụ huynh đã liên kết", "Phụ huynh chưa liên kết"],
//   colors: ["#FFA500", "#00FF00"],
// };

// new ApexCharts(
//   document.querySelector("#countPHlkChart"),
//   countPHlkOptions
// ).render();

////////////////////////////////////////////////////////////

var countLopHD_year = [];
var countLopDong_year = [];
var SoLop = [];

function showClass(data, year) {
  countLopHD_year = [];
  countLopDong_year = [];
  countLopHD_year = Array.from({ length: 12 }, () => 0);
  countLopDong_year = Array.from({ length: 12 }, () => 0);

  data.forEach(function (item) {
    if (item.year == year) {
      countLopHD_year[item.month - 1] = item.openCount || 0; // Đảm bảo giá trị là số
      countLopDong_year[item.month - 1] = item.closeCount || 0; // Đảm bảo giá trị là số
    }
  });

  createclassActiveChart();
}

function createclassActiveChart() {
  var labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  var ctx = document.getElementById("classActiveChart").getContext("2d");

  if (chart_classActiveChar) {
    chart_classActiveChar.destroy();
  }
  chart_classActiveChar = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Lớp hoạt động",
          data: countLopHD_year,
          backgroundColor: "rgba(75, 192, 192, 0.5)", // Màu nền cột
          borderColor: "rgba(75, 192, 192, 1)", // Màu viền cột 1
          borderWidth: 1,
        },
        {
          label: "Lớp đóng",
          data: countLopDong_year,
          backgroundColor: "rgba(255, 99, 132, 0.5)", // Màu nền cột
          borderColor: "rgba(255, 99, 132, 1)", // Màu viền cột 2
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Tháng",
          },
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Số lượng",
          },
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Biểu đồ số lượng lớp thay đổi theo tháng",
          position: "bottom",
          font: {
            family: "Arial",
            size: 18,
            weight: "bold",
            color: "#333333",
          },
        },
      },
    },
  });
}

var selectYear = document.getElementById("select-year");
var currentYearClass;
selectYear.addEventListener("change", function () {
  currentYearClass = selectYear.value;

  showClass(classData, currentYearClass);
});

var selectCenterClass = document.getElementById("select-center-5");

selectCenterClass.addEventListener("change", function () {
  if (selectCenterClass.value) {
    const filterData = analyticData.openClassByMonth.filter(
      (item) => item.centerID == selectCenterClass.value
    );

    classData = filterData[0].data;

    showClass(classData, currentYearClass);

    const totalClassesByCenter = countClassesByStatusForCenter(
      listCenter,
      selectCenterClass.value
    );

    showClassData(totalClassesByCenter, filterData[0]);
  } else {
    classData = Object.values(aggregatedData);
    showClass(classData, currentYearClass);

    const totalClassesByStatus = countClassesByStatus(listCenter);
    showClassData(totalClassesByStatus, "");
  }
});

/// ds lop hoat dong theo nam
function filterByYear(year) {
  countLopHD_year = [];
  countLopDong_year = [];
  countLopHD_year = Array.from({ length: 12 }, () => 0);
  countLopDong_year = Array.from({ length: 12 }, () => 0);

  countLopHD.forEach(function (item) {
    if (item.Nam == year) {
      countLopHD_year[item.Thang - 1] = item.SoLop;
    }
  });
}

// loc so luong lop dong theo thang
// function filterCountLopDong(year) {
//   SoLop = [];
//   for (var month = 1; month <= 12; month++) {
//     var previousMonth = month - 1;
//     if (previousMonth == 0) {
//       previousMonth = 12;
//     }
//     var currentMonthData = ds_LopHD.filter(function (item) {
//       return item.Thang == month && item.Nam == year;
//     });

//     var previousMonthData = ds_LopHD.filter(function (item) {
//       if (previousMonth == 12) {
//         return item.Thang == previousMonth && item.Nam == year - 1;
//       } else return item.Thang == previousMonth && item.Nam == year;
//     });

//     var count = 0;

//     for (var i = 0; i < previousMonthData.length; i++) {
//       var existsInCurrentMonth = currentMonthData.some(function (item) {
//         return item.MaLop == previousMonthData[i].MaLop;
//       });
//       if (!existsInCurrentMonth) {
//         count++;
//       }
//     }
//     if (month > new Date().getMonth() + 1 && year == new Date().getFullYear()) {
//       count = 0;
//     }
//     SoLop.push(count);
//   }
// }

//////////
// var tt = parseInt(countGender[0].so) + parseInt(countGender[1].so);

//biểu đồ tỷ lệ học viên Nam/Nữ

// var genderChart = new Chart(document.getElementById("genderChart"), {
//   type: "pie",
//   data: {
//     labels: ["Nam", "Nữ"],
//     datasets: [
//       {
//         data: [countGender[1].so, countGender[0].so],
//         backgroundColor: ["#3498db", "#e74c3c"],
//       },
//     ],
//   },
//   options: {
//     title: {
//       display: true,
//       text: "Tỷ lệ nam/nữ",
//       fontSize: 18,
//     },
//     plugins: {
//       title: {
//         display: true,
//         text: "Tỷ lệ giới tính học viên",
//         position: "bottom",
//         font: {
//           family: "Arial",
//           size: 18,
//           weight: "bold",
//           color: "#333333",
//         },
//       },
//     },
//   },
// });

///
// theo do tuoi

var selectCenterAge = document.getElementById("select-center-2");

selectCenterAge.addEventListener("change", function () {
  if (selectCenterAge.value) {
    const filterData = analyticData.studentAges.filter(
      (item) => item.centerID == selectCenterAge.value
    );
    const filterData2 = analyticData.numberUserByCenter.filter(
      (item) => item.centerID == selectCenterAge.value
    );

    showAge(filterData[0].studentAges, filterData2[0].studentNumber);
  } else {
    showAge(analyticData.total.studentAges, analyticData.studentNumber);
  }
});

var ageChart;

function showAge(countAges, total) {
  document.getElementById("total-student").innerHTML =
    "Tổng số học viên : " + total + " học viên";

  var countAgeFiltered = [];
  var age_16 = 0;
  for (var i = 5; i <= 16; i++) {
    var item = countAges.find(function (element) {
      return parseInt(element.age) == i;
    });

    if (i < 16) {
      if (item) {
        countAgeFiltered.push(parseInt(item.count));
      } else {
        countAgeFiltered.push(0);
      }
    } else {
      countAges.forEach(function (element) {
        if (element.age >= 16) {
          age_16 += parseInt(element.count);
        }
      });
    }
  }

  countAgeFiltered.push(age_16);

  var ageData = {
    labels: [
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16+",
    ],
    datasets: [
      {
        label: "Số lượng học sinh",
        data: countAgeFiltered,
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  var ageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng học viên",
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Độ tuổi học viên",
        position: "bottom",
        font: {
          family: "Arial",
          size: 18,
          weight: "bold",
          color: "#333333",
        },
      },
    },
  };
  // Hủy biểu đồ trước đó nếu tồn tại
  if (ageChart) {
    ageChart.destroy();
  }

  // Tạo biểu đồ cột mới
  ageChart = new Chart(document.getElementById("ageChart"), {
    type: "bar",
    data: ageData,
    options: ageOptions,
  });
}

// var countAgeFiltered = [];
// var age_16 = 0;
// for (var i = 6; i <= 16; i++) {
//   var item = countAge.find(function (element) {
//     if (element.Tuoi >= 16) {
//       age_16 += parseInt(element.so);
//     } else return parseInt(element.Tuoi) == i;
//   });
//   if (i < 16) {
//     if (item) {
//       countAgeFiltered.push(parseInt(item.so));
//     } else {
//       countAgeFiltered.push(0);
//     }
//   }
// }
// countAgeFiltered.push(age_16);

// var ageData = {
//   labels: ["6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16+"],
//   datasets: [
//     {
//       label: "Số lượng học sinh",
//       data: countAgeFiltered,
//       backgroundColor: "rgba(0, 123, 255, 0.5)",
//       borderColor: "rgba(0, 123, 255, 1)",
//       borderWidth: 1,
//     },
//   ],
// };

// var ageOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   scales: {
//     y: {
//       beginAtZero: true,
//       title: {
//         display: true,
//         text: "Số lượng học viên",
//       },
//     },
//     x: {
//       title: {
//         display: true,
//       },
//     },
//   },
//   plugins: {
//     title: {
//       display: true,
//       text: "Độ tuổi học viên",
//       position: "bottom",
//       font: {
//         family: "Arial",
//         size: 18,
//         weight: "bold",
//         color: "#333333",
//       },
//     },
//   },
// };

// // Tạo biểu đồ cột
// var ageChart = new Chart(document.getElementById("ageChart"), {
//   type: "bar",
//   data: ageData,
//   options: ageOptions,
// });

////
// bieu do tang giam hoc sinh

/////////// rsssss

var tongSoHS = [];

var soHSDKHoc = [];
var soHSKHoc = [];

var selectedYear = new Date().getFullYear();

var selectStudentRes = document.getElementById("select-center-3");

var selectYear_hs = document.getElementById("select-year-hs");

selectYear_hs.addEventListener("change", function () {
  if (selectYear_hs.value) {
    selectedYear = selectYear_hs.value;
  } else {
    selectedYear = new Date().getFullYear();
  }
  showStudentRes(StudentResData, selectedYear);
});

selectStudentRes.addEventListener("change", function () {
  if (selectStudentRes.value) {
    const filterData = analyticData.studentJoinByMonth.filter(
      (item) => item.centerID == selectStudentRes.value
    );

    console.log("filterData", filterData);

    StudentResData = filterData[0].number;

    showStudentRes(StudentResData, selectedYear);
  } else {
    StudentResData = analyticData.total.studentJoinByMonth;
    showStudentRes(StudentResData, selectedYear);
  }
});

function showStudentRes(data, year) {
  filterByYear_Hs(year, data);
  countTotal(analyticData.registedStudentByTime, year);

  createStudentChar();
}

// filterByYear_Hs(new Date().getFullYear());
// countTotal();

// soHSKHoc = tongSoHS.map((value, index) => value - soHSDKHoc[index]);

// createStudentChar();

function createStudentChar() {
  var data = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    total: tongSoHS,
    hocDiHoc: soHSDKHoc,
    hocKhongHoc: soHSKHoc,
  };

  // Vẽ biểu đồ
  var ctx = document.getElementById("studentChart").getContext("2d");
  if (chart_StudentChar) {
    chart_StudentChar.destroy();
  }
  chart_StudentChar = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          type: "bar",
          label: "Tổng số học sinh",
          data: data.total,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          type: "line",
          label: "Số học sinh đăng ký học",
          data: data.hocDiHoc,
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          type: "line",
          label: "Số học sinh không không đăng ký học",
          data: data.hocKhongHoc,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Biểu đồ số lượng học viên",
          position: "bottom",
          font: {
            family: "Arial",
            size: 18,
            weight: "bold",
            color: "#333333",
          },
        },
      },
    },
  });
}

function filterByYear_Hs(year, data) {
  var currentMonth = new Date().getMonth() + 1;

  var currentYear = new Date().getFullYear();
  if (year == currentYear) {
    soHSDKHoc = Array.from({ length: currentMonth }, () => 0);
    soHSKHoc = Array.from({ length: currentMonth }, () => 0);
  } else {
    soHSDKHoc = Array.from({ length: 12 }, () => 0);
    soHSKHoc = Array.from({ length: 12 }, () => 0);
  }

  data.forEach((item) => {
    if (item.year == year) {
      soHSDKHoc[item.month - 1] = item?.joinClassStudent
        ? item.joinClassStudent
        : 0;
    }
  });

  data.forEach((item) => {
    if (item.year == year) {
      soHSKHoc[item.month - 1] = item?.unJoinClassStudent
        ? item.unJoinClassStudent
        : 0;
    }
  });

  // data.forEach((item) => {
  //   if (item.year == year) {
  //     let join = item?.joinClassStudent ? item?.joinClassStudent : 0;
  //     let absent = item?.unJoinClassStudent ? item?.unJoinClassStudent : 0;

  //     tongSoHS[item.month - 1] = parseInt(join) + parseInt(absent);
  //   }
  // });
}

function countTotal(data, year) {
  tongSoHS = [];

  for (var i = 1; i <= 12; i++) {
    var monthData = {
      Thang: i,
      Nam: year,
      so: 0,
    };

    var s = 0;
    data.forEach((item) => {
      if (
        (monthData.Thang >= item.month && monthData.Nam == item.year) ||
        monthData.Nam > item.year
      ) {
        s += parseInt(item.count);
      }
    });

    // for (var j = 0; j < ds_HSTang.length; j++) {
    //   if (
    //     (monthData.Thang >= ds_HSTang[j].Thang &&
    //       monthData.Nam == ds_HSTang[j].Nam) ||
    //     monthData.Nam > ds_HSTang[j].Nam
    //   ) {
    //     s += parseInt(ds_HSTang[j].so);
    //   }
    // }

    var currentMonth = new Date().getMonth() + 1;

    var currentYear = new Date().getFullYear();

    if (
      (monthData.Thang > currentMonth && monthData.Nam == currentYear) ||
      monthData.Nam > currentYear
    ) {
      s = 0;
    }
    monthData.so = s;

    tongSoHS.push(monthData.so);
  }
}
/////////////
///Ty le hoc sinh nghi hoc

var selectCenterAbsent = document.getElementById("select-center-4");

selectCenterAbsent.addEventListener("change", function () {
  if (selectCenterAbsent.value) {
    const filterData = analyticData.studentJoinAttendances.filter(
      (item) => item.centerID == selectCenterAbsent.value
    );
    showAbsentChart(filterData[0].joinCount, filterData[0].unJoinCount);
  } else {
    const totalJoinCount = analyticData.studentJoinAttendances.reduce(
      (total, center) => total + center.joinCount,
      0
    );
    const totalUnjoinCount = analyticData.studentJoinAttendances.reduce(
      (total, center) => total + center.unJoinCount,
      0
    );

    showAbsentChart(totalJoinCount, totalUnjoinCount);
  }
});

function showAbsentChart(attend, absent) {
  document.querySelector("#absentChart").innerHTML = "";
  var countHSDHOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    series: [attend, absent],
    labels: ["Tham gia", "Nghỉ học"],
    colors: ["#6fd332", "#cdb089"],
  };

  new ApexCharts(
    document.querySelector("#absentChart"),
    countHSDHOptions
  ).render();
}

function convertDateFormat(dateString) {
  var dateParts = dateString.split("-");
  var formattedDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
  return formattedDate;
}

function parseCustomDateFormat(dateString, format) {
  var parts = dateString.split("-");
  if (parts.length !== 3) return NaN;

  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1;
  var year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

function showClassData(data, center) {
  document.getElementById("class-detail").innerHTML = "";

  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();
  var currentDate = day + "-" + month + "-" + year;

  var html = "";

  if (center) {
    html += "<h3> Cở sở: " + center.centerName + " </h3> <br>";
  }

  html += "<h3> Tính đến ngày " + currentDate + " :</h3> <br>";
  html +=
    "<ul> <li> Tổng số lớp đã mở : " +
    (parseInt(data[1]) + parseInt(data[2])) +
    "</li>  ";
  html += " <li> Tổng số lớp đang hoạt động : " + data[1] + "</li>  ";
  html += "<li> Tổng số lớp đã hoàn thành : " + data[3] + "</li>  </ul>";

  document.getElementById("class-detail").innerHTML = html;
}

// Mặc định hiển thị tab đầu tiên

document.getElementById("btn-tab1").classList.add("active");

document.getElementById("btn-tab2").addEventListener("click", () => {
  window.location.href = "./manageStatisticalFinance.php";
});

document.getElementById("btn-tab1").addEventListener("click", () => {
  window.location.href = "./manageStatistical.php";
});
