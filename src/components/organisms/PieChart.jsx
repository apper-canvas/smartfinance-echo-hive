import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PieChart = ({ 
  data = [], 
  title = "Expense Breakdown", 
  loading = false, 
  error = null, 
  onRetry 
}) => {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const labels = data.map(item => item.category);
      const values = data.map(item => item.amount);
      
      setChartSeries(values);
      setChartOptions({
        chart: {
          type: "pie",
          height: 350,
          toolbar: {
            show: false,
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
        labels: labels,
        colors: [
          "#0A7E5C", // Primary green
          "#2E8B8A", // Secondary teal
          "#F59E0B", // Accent amber
          "#10B981", // Success green
          "#EF4444", // Error red
          "#3B82F6", // Info blue
          "#8B5CF6", // Purple
          "#F97316", // Orange
          "#EC4899", // Pink
          "#6B7280", // Gray
        ],
        legend: {
          position: "bottom",
          offsetY: 10,
          fontSize: "14px",
          fontFamily: "Inter, system-ui, sans-serif",
          labels: {
            colors: "#374151",
          },
          markers: {
            width: 12,
            height: 12,
            radius: 6,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return val.toFixed(1) + "%";
          },
          style: {
            fontSize: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            colors: ["#fff"],
          },
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 1,
            left: 1,
            blur: 1,
            opacity: 0.45,
          },
        },
        tooltip: {
          enabled: true,
          style: {
            fontSize: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
          y: {
            formatter: function (val, opts) {
              const total = chartSeries.reduce((a, b) => a + b, 0);
              const percentage = ((val / total) * 100).toFixed(1);
              return `$${val.toLocaleString()} (${percentage}%)`;
            },
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: "0%",
            },
            expandOnClick: true,
            customScale: 1,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 300,
              },
              legend: {
                position: "bottom",
                fontSize: "12px",
              },
              dataLabels: {
                style: {
                  fontSize: "11px",
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
        title="No data to display"
        description="Add some transactions to see your expense breakdown in this beautiful pie chart."
        showAction={false}
      />
    );
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          {data.length} categories
        </div>
      </div>
      
      <div className="w-full">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="pie"
          height={350}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chartOptions.colors?.[index] || "#0A7E5C" }}
                />
                <span className="text-sm text-gray-600 truncate">{item.category}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PieChart;