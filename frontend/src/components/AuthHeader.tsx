

function AuthHeader({ header,subheader }: { header?: string, subheader: string }) {
    
    return <div className="flex items-center flex-col">
        <div className="text-2xl font-semibold ">
            {header}
        </div>
        <div className="text-slate-500">
            {subheader}
        </div>

    </div>
}

export default AuthHeader;