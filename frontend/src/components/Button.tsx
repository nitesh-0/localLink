
function Button({content, onClick, width} : {content: string,width?: string, onClick: () => void}){
    return <button type="button" onClick={onClick} className={`text-white ${width ? `w-${width}` : 'w-full'}  bg-black hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2  dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700`}>{content}</button>

}

export default Button