import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [originalUrls, setOriginalUrls] = useState([]);
  const [shortUrls, setShortUrls] = useState([]);
  const [userInput, setUserInput] = useState("");
  // console.log(originalUrls)
  // console.log(shortUrls)

  useEffect(() => {
    const storedCookiesOriginalUrls = localStorage.getItem("originalUrls");
    const storedCookiesShortUrls = localStorage.getItem("shortUrls");

    if (storedCookiesShortUrls) {
      setShortUrls((prev) => JSON.parse(storedCookiesShortUrls));
    }
    if (storedCookiesOriginalUrls) {
      setOriginalUrls((prev) => JSON.parse(storedCookiesOriginalUrls));
    }
  }, []);

  useEffect(() => {
    if (originalUrls.length > 0 && shortUrls.length >0) {
      localStorage.setItem("originalUrls", JSON.stringify(originalUrls));
      localStorage.setItem("shortUrls", JSON.stringify(shortUrls));
    }
  }, [originalUrls, shortUrls]);

  const fetchShortUrl = async (e) => {
    e.preventDefault();

    if (!(userInput && isValidUrl(userInput))) {
      setUserInput("Url not valid");
      return;
    }

    const response = await axios.post("https://ez-shortner-api.vercel.app/", {
      originalUrl: userInput,
    });
    const fetchedShortUrl = response.data.shortUrl;
    console.log(fetchedShortUrl);
    setShortUrls((prev) => {
      if (!prev.includes(fetchedShortUrl)) {
        return [...prev, fetchedShortUrl];
      }
      return prev;
    });

    setOriginalUrls((prev) => {
      if (!prev.includes(userInput)) {
        return [...prev, userInput];
      }
      return prev;
    });

    setUserInput("");
  };

  const isValidUrl = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))" + // domain name or IP
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i" // fragment locator
    );
    // console.log(!!urlPattern.test(url));
    return !!urlPattern.test(url);
  };


  const copyToClipBoard = (url)=> {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="container">
      <h1>EzShortner</h1>
      <div className="innterContainer">
        <div className="inputBox">
          <input
            type="text"
            name="originalUrl"
            placeholder="Enter Link..."
            id="link"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => (e.key == "Enter" ? fetchShortUrl(e) : null)}
          />
          <div className="buttons">
            <button className="btn" onClick={(e) => fetchShortUrl(e)}>
              <span></span>
              <p
                data-start="Done!"
                data-text="start!"
                data-title="Short Me!"
              ></p>
            </button>
          </div>
        </div>
        {shortUrls ? (
          <div className="linkContainer">
            <div className="oriLink">
              {originalUrls.map((data) => (
                <p key={data}>{data.slice(0, 50)}{data.length > 50 ? '...' : ''}</p>
              ))}
            </div>
            <div className="shortLinkContainer">
              {shortUrls.map((data) => (
                <div key={data} className="button-link">
                  <p>{data}</p>
                  <button className="copy" onClick={()=>copyToClipBoard(data)}>
                    <span
                      data-text-end="Copied!"
                      data-text-initial="Copy to clipboard"
                      className="tooltip"
                    ></span>
                    <span>
                      <svg
                        xmlSpace="preserve"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        viewBox="0 0 6.35 6.35"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        className="clipboard"
                      >
                        <g>
                          <path
                            fill="currentColor"
                            d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
                          />
                        </g>
                      </svg>
                      <svg
                        xmlSpace="preserve"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        viewBox="0 0 24 24"
                        height="18"
                        width="18"
                        xmlns="http://www.w3.org/2000/svg"
                        className="checkmark"
                      >
                        <g>
                          <path
                            fill="currentColor"
                            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                          />
                        </g>
                      </svg>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
