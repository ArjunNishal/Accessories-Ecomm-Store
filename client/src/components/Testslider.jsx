import React, { Component } from "react";
import Slider from "react-slick";

export default class Testslider extends Component {
  render() {
    const slides = [
      // Sample slide content, you can replace it with your own content
      {
        id: 1,
        text: "Slide 1",
        backgroundColor: "#FF5733",
      },
      {
        id: 2,
        text: "Slide 2",
        backgroundColor: "#33FF57",
      },
      {
        id: 3,
        text: "Slide 3",
        backgroundColor: "#5733FF",
      },
      {
        id: 4,
        text: "Slide 4",
        backgroundColor: "#FF5733",
      },
      {
        id: 5,
        text: "Slide 5",
        backgroundColor: "#33FF57",
      },
      {
        id: 6,
        text: "Slide 6",
        backgroundColor: "#5733FF",
      },
    ];
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 3,
      speed: 500,
    };
    return (
      <div>
        <h2>Center Mode</h2>
        <Slider {...settings}>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="slide slick-slide"
              style={{ backgroundColor: slide.backgroundColor }}
            >
              <div className="slide-inner">
                <h2>{slide.text}</h2>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
