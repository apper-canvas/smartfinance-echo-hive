import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { format } from "date-fns";

const LineChart = ({ 
  data = [], 
  title = "Income vs Expenses", 
  loading = false, 
  error = null, 
  onRetry 
}) => {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const categories = data.map(item => format(new Date(item.month), "MMM yyyy"));
      const incomeData = data.map(item => item.income);
      const expenseData = data.map(item => item.expenses);
      
      setChartSeries([
        {
          name: "Income",
          data: incomeData,
          type: "line",
        },
        {
          name: "Expenses",
          data: expenseData,
          type: "line",
        },
      ]);
      
      setChartOptions({
        chart: {
          type: "line",
          height: 350,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
          },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        colors: ["#10B981", "#EF4444"],
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: "12px",
              fontFamily: "Inter, system-ui, sans-serif",
              colors: "#6B7280",
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "12px",
              fontFamily: "Inter, system-ui, sans-serif",
              colors: "#6B7280",
            },
            formatter: function (val) {
              return "$" + val.toLocaleString();
            },
          },
        },
        grid: {
          borderColor: "#F3F4F6",
          strokeDashArray: 3,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          fontSize: "14px",
          fontFamily: "Inter, system-ui, sans-serif",
          labels: {
            colors: "#374151",
          },
          markers: {
            width: 8,
            height: 8,
            radius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: true,
          theme: "light",
          style: {
            fontSize: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
          y: {
            formatter: function (val) {
              return "$" + val.toLocaleString();
            },
          },
          marker: {
            show: true,
          },
        },
        markers: {
          size: 4,
          strokeWidth: 2,
          strokeColors: ["#10B981", "#EF4444"],
          fillColors: ["#10B981", "#EF4444"],
          hover: {
            size: 6,
          },
        },
        fill: {
          type: "solid",
          opacity: 1,
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300,
              },
              legend: {
                position: "bottom",
                fontSize: "12px",
              },
              xaxis: {
                labels: {
                  style: {
                    fontSize: "11px",
                  },
                },
              },
              yaxis: {
                labels: {
                  style: {
                    fontSize: "11px",
                  },
                },
              },
            },
          },
        ],
      });
    }
  }, [data]);

  if (loading) {
    return <Loading type="chart" />;
  }

  if (error) {
    return (
      <Error 
        type="chart" 
        message={error} 
        onRetry={onRetry} 
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <Empty 
        type="reports" 
        title="No trend data available"
        description="Add some transactions to see your income vs expenses trend over time."
        showAction={false}
      />
    );
  }

  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const netTotal = totalIncome - totalExpenses;

  return (
    <Card className="h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">{title}</h3>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-gray-600">Total Income:</span>
            <span className="font-semibold text-success">${totalIncome.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-gray-600">Total Expenses:</span>
            <span className="font-semibold text-error">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Net:</span>
            <span className={`font-semibold ${netTotal >= 0 ? "text-success" : "text-error"}`}>
              ${netTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={350}
        />
      </div>
    </Card>
  );
};

export default LineChart;