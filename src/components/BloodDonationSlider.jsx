import React, { useState, useRef, useEffect } from "react";

const GalleryStyleSlider = () => {
    const images = [
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop&q=80",
        "https://imgs.search.brave.com/5lgIC1-O8DYfKTW1x6URNxaCDkzcw_hhcXlgnGeXuyA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTk3/MjEyMjQ0NC9waG90/by9hLW51cnNlLXRy/ZWF0cy1hLWNoaWxk/LXN1ZmZlcmluZy1m/cm9tLXBuZXVtb25p/YS1hdC10aGUtaWN1/LXdhcmQtb2YtdGhl/LWNoaWxkcmVucy1o/b3NwaXRhbC1pbi5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/Nk14dWhiTHB3ZnVi/OWg5OXd5YkhYX0pK/VWV0YjkyeU9BSWZS/bk1tRTl2dz0",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop&q=80",
        "https://imgs.search.brave.com/MyGYEGWOb7OdCQwsb7cu2StTALO_mI522ZsGU8hLBao/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZXZlcnlkYXlo/ZWFsdGguY29tL2lt/YWdlcy8yMDI1L3do/YXQtaXMtYTFjLTE0/NDB4ODEwLmpwZw",
        "https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=600&h=400&fit=crop&q=80",
        "https://imgs.search.brave.com/c6808N7Ump7NAxCmRaNwtGMwNOhsCrC9QPQmdDuoCzU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE1/MTMxMzY0OC9waG90/by9oZWFsdGgtY2Fy/ZS13b3JrZXJzLWFy/ZS1jb2xsZWN0aW5n/LWJsb29kLWZyb20t/dm9sdW50ZWVycy1w/YXJ0aWNpcGF0aW5n/LWluLWEtYmxvb2Qt/ZG9uYXRpb24uanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPXha/eW5JUTNXNlFiRnFo/QlIzSmtpYUNZYUZp/Q1IybDR1Nm9DNmxJ/R1d1Qzg9",
        "https://imgs.search.brave.com/Z_Gh0PnugSYiaJ0CZNhyqUhal2Ec_wtNMZuMks9D9_g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzEzL2Q3/LzQ1LzEzZDc0NTk5/ODYwZGE4YzRiNzY1/NWM4MjcxNDYyNGI5/LmpwZw",
        "https://media.istockphoto.com/id/2162481330/photo/taking-blood-sample-from-a-patient-in-the-hospital.jpg?s=612x612&w=0&k=20&c=PZkrNRqeeY0kY6bSZuuolTdZ8-QrdfDlObir49jasr8="
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const totalVisible = 6 // Number of images visible at once

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    // For smooth auto-scroll every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full pt-16 bg-[#292B37]">
            <div className="max-w-7xl mx-auto px-6">

                {/* Slider Container */}
                <div className="relative flex items-center">


                    {/* Images Track */}
                    <div className="overflow-hidden w-full">
                        <div
                            ref={sliderRef}
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / totalVisible)}%)`,
                                width: `${(images.length / totalVisible) * 100}%`
                            }}
                        >
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-1/4 md:w-1/4 p-2"
                                >
                                    <div className="relative rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={img}
                                            alt={`Blood Donation ${index + 1}`}
                                            className="w-full h-64 md:h-72 object-cover"
                                        />

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Dots */}
                <div className="flex justify-center mt-8 space-x-1">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-red-600 w-10" : "bg-gray-300 hover:bg-red-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryStyleSlider;
