import { useSearchParams } from "react-router-dom";
import ZoomAuth from "./components/ZoomAuth";
import { useZoomAuth } from "../context/ZoomContext";

export default function ZoomRedirect() {
  const { updateZoomAuthState } = useZoomAuth();
  const [searchParams] = useSearchParams();
  const zoomAuthCode = searchParams.get("code");
  ZoomAuth(updateZoomAuthState, zoomAuthCode);
}
