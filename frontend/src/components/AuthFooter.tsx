import { Link } from "react-router-dom";


function AuthFooter({content, link} : {content: string, link: string}){

    return <div className=" flex justify-center gap-1 text-sm text-slate-600">
        <div>
            {content}
        </div>
        <div className="underline">
            <Link to= {link === "Sign In" ? "/signin": "/"} >{link}</Link>
        </div>
        
    </div>
}

export default AuthFooter;

