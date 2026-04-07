import { scaleLinear, scaleBand } from "d3";
import { useState, useEffect } from "react";
import './App.css';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const PADDING_CENTER = 20;

const data = [
  { count: 6, name: "Hantavirus" },
  { count: 7, name: "Tularemia" },
  { count: 7, name: "Dengue" },
  { count: 9, name: "Ebola" },
  { count: 11, name: "E. coli" },
  { count: 15, name: "Tuberculosis" },
  { count: 17, name: "Salmonella" },
  { count: 18, name: "Vaccinia" },
  { count: 54, name: "Brucella" },
];

const start_xaxes = 0;
const end_xaxes = 60;
const step_xaxes = 5;

// Calculate the number of elements: (55 - 0) / 5 + 1 = 12
const length_xaxes = Math.floor((end_xaxes - start_xaxes) / step_xaxes);
const xticks_num = Array.from({ length: length_xaxes }, (_, i) => start_xaxes + (i * step_xaxes));


export default function App() {
  const windowSize = useWindowSize();
  
  // Responsive dimensions
  const width = Math.min(windowSize.width - 80, 650); // Max 650px, accounting for padding
  const height = Math.min(windowSize.height * 0.4, 360); // Max 40% of screen height or 360px
  
  const xScale = scaleLinear()
    .domain([0, 55])
    .range([0, width]);
  
  const yScale = scaleBand()
    .domain(data.map(d => d.name))
    .range([height, 0])
    .padding(0.25);
  
  const allXticks = xticks_num.map((x, i) => (
    <g key={i}>
      <line x1={xScale(x)} y1={0} x2={xScale(x)} y2={height} 
      stroke="#808080" opacity={0.2} />
      
      <text x={xScale(x)} y={-10} 
      textAnchor="middle" 
      alignmentBaseline="central" 
      font="Roboto Fallback"
      fontSize={12}
       fill="#808080" color="0F172A" opacity={1}>
        {x}
      </text>
      
    </g>
  ));
  
  const allBars = data.map((d, i) => (
    <g key={i}>
    <rect
      key={i}
      x={xScale(0)}
      y={yScale(d.name)}
      width={xScale(d.count ) - xScale(0)}
      height={yScale.bandwidth()}
      stroke="#076fa2" fill="#076fa2"
    />
    {d.count > 8 ? (
      <text x={xScale(1)} 
      y={yScale(d.name) + yScale.bandwidth() / 2} 
        textAnchor="start" 
        alignmentBaseline="central" 
        font="Roboto Fallback"
        fontSize={14}
         fill="white" opacity={0.9}>
          {d.name}
        </text>
    ) : (
      <text x={xScale(d.count + 1)} 
      y={yScale(d.name) + yScale.bandwidth() / 2} 
        textAnchor="start" 
        alignmentBaseline="central" 
        font="Roboto Fallback"
        fontSize={14}
         fill="#076fa2" opacity={0.9}>
          {d.name}
        </text>
    )}
      </g>
  ));

 
  return (
    <div className="app-container">
      <div className="content-wrapper">
      <div className="header">
        <div className="header-line">
        </div>
        <div className="header-box">
        </div>
        <span className="header-title">
          <b>Escape artists</b>
        </span>
        <br />
        <span className="header-subtitle">Number of laboratory-acquired infections, 1970-2021</span>
      </div>
      <div>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="svg-container">
          {/* Background */}
          {allXticks}
          {allBars}
        </svg>
      </div>
      <div className="footer">
        <span>
          Sources: Laboratory-Acquired Infection Database; American Biological Safety Association
          </span>
          <br />
          <span className="footer">
            The Economist
            </span>
      </div>
      </div>
    </div>
  );
}