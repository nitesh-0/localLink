

function InputBox({label, placeholder, value, type, onChange}: {label?: string, value?: string, placeholder: string, type?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void}){
    return <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 ">{label}</label>
            <input id="first_name" value={value} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 " placeholder={placeholder} type={type} required />
        </div>
}

export default InputBox;