import type { ChangeEvent } from "react";


function TextArea({label, value, placeholder, onChange} : {label?: string, value?: string, placeholder: string, onChange : (e: ChangeEvent<HTMLTextAreaElement>) => void }){

    return <div>
        
<label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
<textarea onChange={onChange} id="message" className="block p-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" value={value} placeholder={placeholder}></textarea>

    </div>
}

export default TextArea;