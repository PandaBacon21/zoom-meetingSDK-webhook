import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ZoomAuth(updateZoomAuthState, zoomAuthCode) {
  const navigate = useNavigate();
  useEffect(() => {
    const sendAuthCode = async () => {
      try {
        const res = await axios({
          method: "POST",
          url: "/api/zoom-auth-token",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({
            auth_code: zoomAuthCode,
          }),
          withCredentials: true,
        });
        console.log(res.data);
        console.log(res.status);
        if (res.status === 200) {
          console.log("Zoom auth successful, navigating to /dashboard");
          updateZoomAuthState(true);
          navigate("/dashboard");
        }
      } catch (e) {
        console.log(e.response.data);
        if (e.response.data) {
          alert(`An error occurred: ${e.response.data.message}`);
        } else {
          alert("An error occurred");
        }
      }
    };
    sendAuthCode();
  }, []);
}
