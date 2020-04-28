import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import "./styles.css";

const D3Comp = () => {
  const divRef = useRef(null);
  const width = 640;
  const height = 300;
  const boxWidth = 20;
  const boxHeight = 20;
  const rowWidth = 300;
  const rowHeight = 28;
  const colHeight = 24;
  const colWidth = 24;
  //const color = d3.scaleOrdinal().range(d3.schemeCategory10);
  const splitSq = [{ x1: 0, x2: 300, y1: 5, y2: 300, name: "rectangle1" }];

  const cols = Array.from({ length: 9 }).map((n, i) => {
    return Array.from({ length: 9 }).map((_, ii) => {
      return {
        x: 346 + ii * 33,
        y: 2 + i * 34,
        id: `col-${i}-${ii}`,
        index: i
      };
    });
  });
  const rows = Array.from({ length: 9 }).map((_, i) => {
    return {
      x: 340,
      y: i * 34,
      id: `row-${i}`
    };
  });
  //let arr = [];
  let arr = Array.from({ length: 9 });
  let newArr = arr.map(e => []);
  let testArr = [];

  const random = d3.randomUniform(9, 10);
  const rects = d3.range(20).map((_, i) => {
    return {
      x: Math.round(Math.random() * (height - boxWidth)),
      y: Math.round(Math.random() * (height - boxHeight))
    };
  });
  const [array, setArray] = useState(newArr);

  useEffect(() => {
    rows.map((_, i) => {
      d3.select(divRef.current)
        .append("div")
        .attr("id", `row-${i}-info`)
        .text(`bricks in row ${i}: `);
      d3.select(`#row-${i}-info`)
        .append("span")
        .attr("id", `row-${i}-text`)
        .text("0");
    });
    d3.select(divRef.current)
      .append("div")
      .attr("id", "x_var")
      .text("x: ");
    d3.select(divRef.current)
      .append("div")
      .attr("id", "y_var")
      .text("y: ");
    d3.select("#x_var")
      .append("span")
      .attr("id", "x_coord");
    d3.select("#y_var")
      .append("span")
      .attr("id", "y_coord");

    let svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    /*    svg
      .append("foreignObject")
      .attr("y", 0)
      .attr("x", 300)
      .attr("width", 40)
      .attr("height", 40)
      .attr("id", "svg-input");

    d3.select("#svg-input")
      .append("xhtml:div")
      .append("div")
      .append("input")
      .text("333")
      .style("color", "green"); */

    svg
      .selectAll("rect")
      .data(splitSq)
      .enter()
      .append("rect")
      .attr("x", d => d.x1)
      .attr("y", d => {
        return d.y1;
      })
      .attr("width", d => d.x2 - d.x1)
      .attr("height", d => d.y2 - d.y1)
      .attr("fill", "none")
      .style("stroke", "#ddd")
      .style("stroke-width", 2)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("id", d => {
        return `${d.name}`;
      });
    svg
      .selectAll("rows")
      .data(rows)
      .enter()
      .append("g")
      .attr("id", d => `g-${d.id}`)
      .append("rect")
      .attr("y", d => {
        return d.y;
      })
      .attr("x", d => d.x)
      .attr("width", rowWidth)
      .attr("height", rowHeight)
      .attr("fill", "none")
      .style("stroke", "#ddd")
      .style("stroke-width", 2)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("id", d => d.id)
      .attr("class", "row")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    function handleMouseOver(d, i) {
      d3.select(this)
        .style("cursor", "pointer")
        .style("stroke", "#4DA3E1")
        .style("opacity", "0.5")
        .style("fill", "#92D5FB");
    }
    function handleMouseOut(d) {
      d3.select(this)
        .style("stroke", "ddd")
        .style("opacity", "1")
        .style("fill", "none");
    }

    cols.forEach((element, i) => {
      svg
        .selectAll("cols")
        .data(element)
        .enter()
        .append("rect")
        .attr("y", d => {
          return d.y;
        })
        .attr("x", d => d.x)
        .attr("width", colWidth)
        .attr("height", colHeight)
        .attr("fill", "none")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("class", "slot")
        .attr("id", d => {
          return d.id;
        });
    });

    /*  d3
          .forceManyBody()
          .strength(-2)
          .distanceMax([100, 100]) */

    /*  var collisionForce = d3
      .forceCollide(12)
      .strength(2)
      .iterations(100); */

    var simulation = d3
      .forceSimulation(rects)
      .force("charge", d3.forceManyBody().strength(-2))
      .force("center", d3.forceCenter(150, 150))
      .force(
        "collision",
        d3.forceCollide().radius(function(d) {
          return d.radius;
        })
      );

    /*  .force(
      "collision",
      d3
        .forceCollide(12)
        .strength(2)
        .iterations(100)
    ) */
    var node = svg
      .selectAll("rects")
      .data(rects)
      .enter()
      .append("rect")
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("class", "box")
      .style("fill", "#4DA3E1")
      .style("stroke", "#0E3F63")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
    function ticked() {
      node
        .attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y;
        });
    }

    simulation.on("tick", ticked);

    /*  function ticked() {
      var u = svg.selectAll("rects").data(rects);

      u.enter()
        .append("rect")
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .merge(u)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("class", "box")
        .attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y;
        })
        .style("fill", "#4DA3E1")
        .style("stroke", "#0E3F63")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

    u.exit().remove();
    } */

    /*  svg
      .selectAll("rects")
      .data(rects)
      .enter()
      .append("rect")
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("class", "box")

      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .style("fill", "#4DA3E1")
      .style("stroke", "#0E3F63")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      ); */

    function dragstarted(d) {
      simulation.stop();
      d3.select(this)
        .style("stroke", "#4DA3E1")
        .style("fill", "#92D5FB")
        .style("cursor", "pointer");
    }
    function dragged(d) {
      d3.select(this)
        .attr("x", (d.x = Math.max(0, Math.min(width - boxWidth, d3.event.x))))
        .attr(
          "y",
          (d.y = Math.max(0, Math.min(height - boxHeight, d3.event.y)))
        );
      d3.select("#x_coord").text(d.x);
      d3.select("#y_coord").text(d.y);
    }
    function dragended(b) {
      let box = this;
      console.log(`dragended`, b);
      d3.select(this)
        .style("fill", "#4DA3E1")
        .style("stroke", "#0E3F63");

      let isIntersected = false;
      let intersectedArea = null;
      let intersectedAreaIndex = null;

      svg.selectAll(".row").each(function(t, i) {
        let topLeftRow = { x: t.x, y: t.y };
        let bottomRightRow = { x: t.x + rowWidth, y: t.y + rowHeight };
        let topLeftBox = { x: b.x, y: b.y };
        let bottomRightBox = { x: b.x + boxWidth, y: b.y + boxHeight };

        const intersecting_area =
          Math.max(
            0,
            Math.min(bottomRightBox.x, bottomRightRow.x) -
              Math.max(topLeftBox.x, topLeftRow.x)
          ) *
          Math.max(
            0,
            Math.min(bottomRightBox.y, bottomRightRow.y) -
              Math.max(topLeftBox.y, topLeftRow.y)
          );
        if (intersecting_area) {
          console.log(
            `collision boxX: ${b.x} boxY: ${b.y} targetX: ${t.x} targetY: ${
              t.y
            }`
          );
          if (intersecting_area && intersectedArea > intersecting_area) {
            console.log(`intersectedArea bigger`);
            let newA = [...array];
            newA[intersectedAreaIndex].pop();
            let arrL = newA[intersectedAreaIndex].length;
            if (arrL <= 9) {
              newA[i].push(1);
              setArray(newA);

              console.log(
                `arrLength`,
                newA,
                arrL,
                `#row-${intersectedAreaIndex}-text`
              );
              d3.select(box)
                .attr(
                  "transform",
                  `translate(${t.x + arrL * 32 - b.x + 6}, ${t.y - b.y + 4})`
                )
                .transition()
                .duration(500);
              d3.select(`#row-${intersectedAreaIndex}-text`).text(arrL + 1);
            }
          } else if (
            intersecting_area &&
            intersectedArea &&
            intersectedArea <= intersecting_area
          ) {
            console.log(`intersectedArea small`);
            let newA = [...array];
            newA[intersectedAreaIndex].pop();
            let arrL = newA[intersectedAreaIndex].length;
            if (arrL <= 9) {
              newA[i].push(1);
              setArray(newA);

              console.log(
                `arrLength`,
                newA,
                arrL,
                `#row-${intersectedAreaIndex}-text`
              );
              d3.select(box).attr(
                "transform",
                `translate(${t.x + arrL * 32 - b.x + 6}, ${t.y - b.y + 4})`
              );
              d3.select(`#row-${intersectedAreaIndex}-text`).text(arrL + 1);
            }
          } else if (intersecting_area) {
            console.log(`intersectedArea default`, intersectedArea);

            intersectedArea = intersecting_area;
            intersectedAreaIndex = i;

            let newA = [...array];
            let arrL = newA[i].length;
            if (arrL <= 9) {
              newA[i].push(1);
              setArray(newA);

              console.log(`arrLength 2`, newA, arrL, `#row-${i}-text`);
              d3.select(box).attr(
                "transform",
                `translate(${t.x + arrL * 32 - b.x + 6}, ${t.y - b.y + 4})`
              );
              d3.select(`#row-${i}-text`).text(arrL + 1);
            }
          }

          function scanSlots() {
            svg.selectAll(`.slot`).each(function(s, iii) {
              //console.log(`scanning`, i, iii, s);
              svg.selectAll(".box").each(function(dd, i) {
                console.log(
                  `looking intersect for boxX: ${dd.x} boxY: ${dd.y}`
                );
                let topLeftSlot = { x: s.x, y: s.y };
                let bottomRightSlot = { x: s.x + colWidth, y: s.y + colHeight };
                let topLeftBoxs = { x: dd.x, y: dd.y };
                let bottomRightBoxs = {
                  x: dd.x + boxWidth,
                  y: dd.y + boxHeight
                };

                const intersecting_area2 =
                  Math.max(
                    0,
                    Math.min(bottomRightBoxs.x, bottomRightSlot.x) -
                      Math.max(topLeftBoxs.x, topLeftSlot.x)
                  ) *
                  Math.max(
                    0,
                    Math.min(bottomRightBoxs.y, bottomRightSlot.y) -
                      Math.max(topLeftBoxs.y, topLeftSlot.y)
                  );
                if (intersecting_area2 > 0) {
                  console.log(
                    `intersect slotX: ${s.x} slotY: ${s.y} boxX: ${
                      dd.x
                    } boxY: ${dd.y}`
                  );
                }
                /* var a = dd.x - s.x;
                var y = s.y - dd.y;
                var distance = Math.sqrt(a * a + y * y);
                if (distance < boxWidth) {
                  console.log(
                    `scan slotX: ${s.x} slotY: ${s.y} boxX: ${dd.x} boxY: ${
                      dd.y
                    }`
                  );
                  /* d3.select(box).attr(
                    "transform",
                    `translate(${d.x - b.x + 2}, ${d.y - b.y + 2})`
                  ); */
                //}
              });
            });
          }
          //scanSlots();

          /*  d3.select(box)
            .attr("x", t.x + 4)
            .attr("y", t.y + 4); */
          /*  d3.select(box).attr(
            "transform",
            `translate(${t.x - b.x + 4}, ${t.y - b.y + 4})`
          ); */

          /*  d3.select(box).attr(
            "transform",
            `translate(${t.x - b.x + 4}, ${t.y - b.y + 4})`
          ); */
        }
      });
    }
  }, []);
  console.log(`render`, array);

  return <div ref={divRef} />;
};

function App() {
  return (
    <div className="App">
      <h4>Playing with d3 Drag and Drop Array Model</h4>
      <D3Comp />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

/*   svg.selectAll(".column").each(function(d, i) {
        var a = d.x - b.x;
        var y = b.y - d.y;
        var c = Math.sqrt(a * a + y * y);
        var distance = c;
        if (distance < boxWidth) {
          console.log(
            `collision boxX: ${b.x} boxY: ${b.y} targetX: ${d.x} targetY: ${
              d.y
            }`
          );
          d3.select(box).attr(
            "transform",
            `translate(${d.x - b.x + 2}, ${d.y - b.y + 2})`
          );
        }
      }); */
