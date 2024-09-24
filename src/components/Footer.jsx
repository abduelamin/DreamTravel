import { LocationOn, LocalPhone, Email } from "@mui/icons-material"
import placeholderLogo from "../assets/logo.png";
const Footer = () => {
    return (
      <footer className="flex justify-between items-center gap-12 px-6 py-4 md:px-8 lg:px-16 bg-gray-100 w-screen">
       
        <div className="max-w-xs">
          <a href="/">
            <img
              src={placeholderLogo}
              alt="logo"
              className="w-40 mb-4 transition-transform transform hover:scale-110"
            />
          </a>
          <div className="flex gap-4 mt-4">
            {/* <div className="w-10 h-10 bg-red-500 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform duration-300">
              
              <i className="text-white">FB</i>
            </div> */}
            <div className="w-12 h-12 bg-red-500 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform duration-300">
              <i className="text-white">X</i>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform duration-300">
              <i className="text-white">IG</i>
            </div>
          </div>
        </div>
  
        
        <div className="hidden md:block text-center">
          <h3 className="text-lg font-semibold text-gray-800">Useful Links</h3>
          <ul className="mt-4 space-y-2 cursor-pointer">
            <li className="transition-colors hover:text-red-500">About Us</li>
            <li className="transition-colors hover:text-red-500">
              Terms and Conditions
            </li>
            <li className="transition-colors hover:text-red-500">
              Return and Refund Policy
            </li>
          </ul>
        </div>
  
        
        <div className="max-w-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
          <div className="flex items-center mb-3 space-x-4">
            <LocalPhone className="text-red-500" />
            <p className="text-gray-700">+1 234 567 890</p>
          </div>
          <div className="flex items-center mb-3 space-x-4">
            <Email className="text-red-500" />
            <p className="text-gray-700">dreamnest@support.com</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;