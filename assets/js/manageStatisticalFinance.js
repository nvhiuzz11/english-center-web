var analyticData;
var listCenter;

////////////
var chart_doanhthu = null;
var thuChiChart = null;

const selectElement = document.getElementById("select-year-1");
const selectElement2 = document.getElementById("select-year-2");
const selectElement3 = document.getElementById("select-year-3");
const currentYear = new Date().getFullYear();

for (let i = 2020; i <= 2100; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;

  if (i === currentYear) {
    option.selected = true;
  }

  selectElement.appendChild(option);
}

for (let i = 2020; i <= 2100; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;

  if (i === currentYear) {
    option.selected = true;
  }

  selectElement2.appendChild(option);
}

for (let i = 2020; i <= 2100; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;

  if (i === currentYear) {
    option.selected = true;
  }

  selectElement3.appendChild(option);
}

///////data
var aggregatedData1 = {};
var aggregatedData2 = {};
var profitByMonths;
var profitByYears;
///

const accessToken = localStorage.getItem("accessToken");

const store_analyticData = localStorage.getItem("analyticData");
if (store_analyticData) {
  analyticData = JSON.parse(store_analyticData);

  analyticData.profitByMonths.forEach((center) => {
    center.data.forEach((record) => {
      const key = `${record.month}-${record.year}`;

      if (!aggregatedData1[key]) {
        aggregatedData1[key] = {
          month: record.month,
          year: record.year,
          income: 0,
          expend: 0,
          profit: 0,
        };
      }

      // Accumulate the data
      aggregatedData1[key].income += record.income;
      aggregatedData1[key].expend += record.expend;
      aggregatedData1[key].profit += record.profit;
    });
  });

  profitByMonths = Object.values(aggregatedData1);

  showByMonth(profitByMonths, new Date().getFullYear());
  showProfit(profitByMonths, new Date().getFullYear());

  analyticData.profitByYears.forEach((center) => {
    center.data.forEach((record) => {
      const key = `${record.year}`;

      if (!aggregatedData2[key]) {
        aggregatedData2[key] = {
          year: record.year,
          income: 0,
          expend: 0,
          profit: 0,
        };
      }

      // Accumulate the data
      aggregatedData2[key].income += record.income;
      aggregatedData2[key].expend += record.expend;
      aggregatedData2[key].profit += record.profit;
    });
  });

  profitByYears = Object.values(aggregatedData2);
  showProfitPercent(profitByYears, new Date().getFullYear());
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

      analyticData.profitByMonths.forEach((center) => {
        center.data.forEach((record) => {
          const key = `${record.month}-${record.year}`;

          if (!aggregatedData1[key]) {
            aggregatedData1[key] = {
              month: record.month,
              year: record.year,
              income: 0,
              expend: 0,
              profit: 0,
            };
          }

          // Accumulate the data
          aggregatedData1[key].income += record.income;
          aggregatedData1[key].expend += record.expend;
          aggregatedData1[key].profit += record.profit;
        });
      });

      profitByMonths = Object.values(aggregatedData1);

      showByMonth(profitByMonths, new Date().getFullYear());
      showProfit(profitByMonths, new Date().getFullYear());

      analyticData.profitByYears.forEach((center) => {
        center.data.forEach((record) => {
          const key = `${record.year}`;

          if (!aggregatedData2[key]) {
            aggregatedData2[key] = {
              year: record.year,
              income: 0,
              expend: 0,
              profit: 0,
            };
          }

          // Accumulate the data
          aggregatedData2[key].income += record.income;
          aggregatedData2[key].expend += record.expend;
          aggregatedData2[key].profit += record.profit;
        });
      });

      profitByYears = Object.values(aggregatedData2);
      showProfitPercent(profitByYears, new Date().getFullYear());

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

      var select1 = document.getElementById("select-center-1");
      var select2 = document.getElementById("select-center-2");
      var select3 = document.getElementById("select-center-3");

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

        select2.appendChild(option);
      });

      listCenter.forEach((center) => {
        const option = document.createElement("option");
        option.value = center.id;
        option.text = `Cơ sở ${center.id}: ${center.name}`;

        select3.appendChild(option);
      });

      localStorage.setItem("listCenter", JSON.stringify(listCenter));
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// bieu do thu chi hang thang

var doanhThu = [];
var thu = [];
var chi = [];

var selectedYear_1 = new Date().getFullYear();

var selectYear_1 = document.getElementById("select-year-1");
selectYear_1.addEventListener("change", function () {
  // selectedYear_1 = selectYear_1.value;
  // filterByYear_1(selectedYear_1);

  // doanhThu = thu.map((value, index) => value - chi[index]);
  // createStudentChar();

  if (selectYear_1.value) {
    selectedYear_1 = selectYear_1.value;
  } else {
    selectedYear_1 = new Date().getFullYear();
  }
  showByMonth(profitByMonths, selectedYear_1);
});

var selectCenterMonth = document.getElementById("select-center-1");

selectCenterMonth.addEventListener("change", function () {
  if (selectCenterMonth.value) {
    const filterData = analyticData.profitByMonths.filter(
      (item) => item.centerID == selectCenterMonth.value
    );

    console.log("filterData", filterData);

    profitByMonths = filterData[0].data;

    showByMonth(profitByMonths, selectedYear_1);
  } else {
    profitByMonths = Object.values(aggregatedData1);
    showByMonth(profitByMonths, selectedYear_1);
  }
});

function showByMonth(data, year) {
  filterByYear_1(data, year);

  createStudentChar();
}

// filterByYear_1(new Date().getFullYear());

// doanhThu = thu.map((value, index) => value - chi[index]);

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
    total: doanhThu,
    soThu: thu,
    soChi: chi,
  };

  // Vẽ biểu đồ
  var ctx = document.getElementById("chart-1").getContext("2d");
  if (chart_doanhthu) {
    chart_doanhthu.destroy();
  }
  chart_doanhthu = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          type: "bar",
          label: "Doanh thu",
          data: data.total,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          type: "line",
          label: "Chi",
          data: data.soChi,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          type: "line",
          label: "Thu",
          data: data.soThu,
          borderColor: "rgba(54, 162, 235, 1)",
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
          text: "Biểu đồ thu chi hàng tháng",
          position: "bottom",
          font: {
            family: "Arial",
            size: 22,
            weight: "bold",
            color: "#333333",
          },
        },
      },
    },
  });
}

function filterByYear_1(data, year) {
  thu = Array.from({ length: 12 }, () => 0);
  chi = Array.from({ length: 12 }, () => 0);
  doanhThu = Array.from({ length: 12 }, () => 0);

  data.forEach(function (item) {
    if (item.year == year) {
      thu[item.month - 1] = parseInt(item.income);
    }
  });
  data.forEach(function (item) {
    if (item.year == year) {
      chi[item.month - 1] = parseInt(item.expend);
    }
  });
  data.forEach(function (item) {
    if (item.year == year) {
      doanhThu[item.month - 1] = parseInt(item.profit);
    }
  });
}

///////////////////////////////////////////////////////////

var tongDoanhThu = [];
var tyLeLoiNhuan = [];
var dtThang12 = 0;
var selectedYear_2 = new Date().getFullYear();

var selectYear_2 = document.getElementById("select-year-2");
selectYear_2.addEventListener("change", function () {
  if (selectYear_2.value) {
    selectedYear_2 = selectYear_2.value;
  } else {
    selectedYear_2 = new Date().getFullYear();
  }
  showProfit(profitByMonths, selectedYear_2);
});

var selectCenterProfit = document.getElementById("select-center-2");

selectCenterProfit.addEventListener("change", function () {
  if (selectCenterProfit.value) {
    const filterData = analyticData.profitByMonths.filter(
      (item) => item.centerID == selectCenterProfit.value
    );

    profitByMonths = filterData[0].data;

    showProfit(profitByMonths, selectedYear_2);
  } else {
    profitByMonths = Object.values(aggregatedData1);
    showProfit(profitByMonths, selectedYear_2);
  }
});

function showByMonth(data, year) {
  filterByYear_1(data, year);

  createStudentChar();
}

function showProfit(data, year) {
  countTotal(data, year);

  countProfitRate();
  console.log("tongDoanhThu", tongDoanhThu);
  console.log("tyLeLoiNhuan", tyLeLoiNhuan);
  createDoanhThuChart();
}

// countTotal(tongDoanhThu);
// countProfitRate(tyLeLoiNhuan, tongDoanhThu);

// createDoanhThuChart(tongDoanhThu, tyLeLoiNhuan);

function countTotal(data, selectYear) {
  tongDoanhThu = [];
  dtThang12 = 0;

  for (var i = 1; i <= 12; i++) {
    var monthData = {
      Thang: i,
      Nam: selectYear,
      so: 0,
    };

    var s = 0;

    for (var j = 0; j < data.length; j++) {
      if (
        (monthData.Thang >= data[j].month && monthData.Nam == data[j].year) ||
        monthData.Nam > data[j].year
      ) {
        s += parseInt(data[j].profit);
      }
    }
    monthData.so = s;
    tongDoanhThu.push(monthData.so);
  }
  for (var k = 0; k < data.length; k++) {
    if (
      (12 >= data[k].Thang && monthData.Nam - 1 == data[k].year) ||
      monthData.Nam - 1 > data[k].year
    ) {
      dtThang12 += parseInt(data[k].profit);
    }
  }
}

function countProfitRate() {
  tyLeLoiNhuan = [];

  // Tính tỷ lệ lợi nhuận của tháng 1 n

  if (dtThang12 == 0) {
    tyLeLoiNhuan.push(parseFloat(0).toFixed(2));
  } else {
    var tyLeThang1 = ((tongDoanhThu[0] - dtThang12) / dtThang12) * 100;

    tyLeLoiNhuan.push(tyLeThang1.toFixed(2));
  }
  for (var i = 1; i < tongDoanhThu.length; i++) {
    var doanhThuHienTai = tongDoanhThu[i];
    var doanhThuTruoc = tongDoanhThu[i - 1];
    if (doanhThuTruoc == 0 && doanhThuHienTai == 0) {
      tyLeLoiNhuan.push(parseFloat(0).toFixed(2));
    } else if (doanhThuTruoc == 0 && doanhThuHienTai != 0) {
      if (doanhThuHienTai > 0) tyLeLoiNhuan.push(parseFloat(100).toFixed(2));
      else tyLeLoiNhuan.push(parseFloat(-100).toFixed(2));
    } else {
      if (doanhThuTruoc > 0 && doanhThuHienTai > 0) {
        var tyLe = ((doanhThuHienTai - doanhThuTruoc) / doanhThuTruoc) * 100;
      } else if (doanhThuTruoc < 0 && doanhThuHienTai < 0) {
        var tyLe =
          -(
            (Math.abs(doanhThuHienTai) - Math.abs(doanhThuTruoc)) /
            Math.abs(doanhThuTruoc)
          ) * 100;
      } else if (doanhThuTruoc > 0 && doanhThuHienTai < 0) {
        var tyLe =
          -(
            (Math.abs(doanhThuHienTai) + Math.abs(doanhThuTruoc)) /
            Math.abs(doanhThuTruoc)
          ) * 100;
      } else if (doanhThuTruoc < 0 && doanhThuHienTai > 0) {
        var tyLe =
          ((Math.abs(doanhThuHienTai) + Math.abs(doanhThuTruoc)) /
            Math.abs(doanhThuTruoc)) *
          100;
      }

      tyLeLoiNhuan.push(parseFloat(tyLe).toFixed(2));
    }
  }
}

function createDoanhThuChart() {
  document.querySelector("#chart-2").innerHTML = "";
  var chartData = {
    chart: {
      type: "area",
      height: 700,
    },
    series: [
      {
        name: "Tổng doanh thu",
        data: tongDoanhThu,
      },
      {
        name: "Tỷ lệ lợi nhuận",
        data: tyLeLoiNhuan,
      },
    ],
    xaxis: {
      categories: [
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
    },
    yaxis: [
      {
        title: {
          text: "Tổng doanh thu (VND)",
        },
      },
      {
        opposite: true,
        title: {
          text: "Tỷ lệ lợi nhuận (%) ",
        },
      },
    ],
    fill: {
      type: "solid",
      opacity: [0.7, 0.5],
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart-2"), chartData);
  chart.render();
}

///////////Biểu đồ tổng doanh thu và tỉ lệ lợi nhuận
var selectedYear_3 = new Date().getFullYear();

var selectYear_3 = document.getElementById("select-year-3");
selectYear_3.addEventListener("change", function () {
  if (selectYear_3.value) {
    selectedYear_3 = selectYear_3.value;
  } else {
    selectedYear_3 = new Date().getFullYear();
  }
  showProfitPercent(profitByYears, selectedYear_3);
});

var selectCenterProfitPercent = document.getElementById("select-center-3");

selectCenterProfitPercent.addEventListener("change", function () {
  if (selectCenterProfitPercent.value) {
    const filterData = analyticData.profitByMonths.filter(
      (item) => item.centerID == selectCenterProfitPercent.value
    );

    profitByYears = filterData[0].data;

    showProfitPercent(profitByYears, selectedYear_3);
  } else {
    profitByYears = Object.values(aggregatedData2);
    showProfitPercent(profitByYears, selectedYear_3);
  }
});

function showProfitPercent(data, year) {
  var thu = 0;
  var chi = 0;

  for (var i = 0; i < data.length; i++) {
    if (year == data[i].year) {
      thu = parseInt(data[i].income);
      chi = parseInt(data[i].expend);
    }
  }

  createThuChiChart(thu, chi);
}

function createThuChiChart(thu, chi) {
  var data = {
    labels: ["Thu", "Chi"],
    datasets: [
      {
        data: [thu, chi],
        backgroundColor: ["#11d66e", "#ff5c5c"],
      },
    ],
  };

  if (thuChiChart) {
    thuChiChart.destroy();
  }

  if (thu == 0 && chi == 0) {
    document.getElementById("chart-3-empty").style.display = "block";
  } else {
    document.getElementById("chart-3-empty").style.display = "none";
    var ctx = document.getElementById("chart-3").getContext("2d");

    thuChiChart = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        title: {
          display: true,
          text: "Tỷ lệ thu / chi",
        },
        plugins: {
          title: {
            display: true,
            text: "Biểu đồ thu chi hàng năm",
            position: "bottom",
            font: {
              family: "Arial",
              size: 18,
              weight: "bold",
            },
          },
        },
      },
    });
  }
}

// Mặc định hiển thị tab đầu tiên

document.getElementById("btn-tab2").classList.add("active");
document.getElementById("btn-tab2").addEventListener("click", () => {
  window.location.href = "./manageStatisticalFinance.php";
});

document.getElementById("btn-tab1").addEventListener("click", () => {
  window.location.href = "./manageStatistical.php";
});
