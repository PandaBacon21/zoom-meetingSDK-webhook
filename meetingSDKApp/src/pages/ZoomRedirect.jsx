import { useSearchParams } from "react-router-dom";
//import ZoomAuth from

export default function ZoomRedirect() {
  const [searchParams] = useSearchParams();
  const zoomAuthCode = searchParams.get("code");
  //ZoomAuth(zoomAuthCode)
}
