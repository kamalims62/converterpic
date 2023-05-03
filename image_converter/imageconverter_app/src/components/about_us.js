import React from "react";

const AboutUs = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          background: "linear-gradient(to right, #0072ff, #00c6ff)",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "4rem" }}>
          ImageConvertZone.com
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          background: "linear-gradient(to right, #8b008b, #ff1493)",
          color: "#fff",
          fontSize: "1.5rem",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "800px", textAlign: "center" }}>
          <p>
            We at ImageConvertZone.com are dedicated to providing fast and
            secure image format conversion services. Our app allows you to
            convert your images from one format to another without the need to
            store your images on our servers. This ensures that your images are
            always secure and only you have access to them.
          </p>
          <p>
            Our app supports a wide range of image formats including JPG, JPEG,
            PNG, GIF, WebP, TIFF, and BMP. Simply select the image format you
            want to convert from and the format you want to convert to, and we
            will do the rest.
          </p>
          <p>
            At ImageConvertZone.com, we understand the importance of your data
            and we take data security and reliability very seriously. That's why
            we have designed our app to ensure that your images are never stored
            on our servers.
          </p>
          <p>
            Thank you for choosing ImageConvertZone.com for your image format
            conversion needs. If you have any questions or feedback, please feel
            free to contact us at support@imageconvertzone.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
