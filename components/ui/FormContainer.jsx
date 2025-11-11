export default function FormContainer({ title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden 
                      transition-all duration-600 hover:shadow-3xl hover:-translate-y-1
                      group"> {/* Add group class */}

                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF5528] to-[#FF8C66] z-10"></div>

                    <div className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] rounded-full 
                        bg-gradient-to-br from-[#FF552833] to-transparent opacity-30 
                        transition-all duration-800 
                        group-hover:scale-125 group-hover:-translate-x-5 group-hover:translate-y-5"> {/* Group hover */}
                    </div>
                    <div className="absolute bottom-[-80px] left-[-80px] w-[200px] h-[200px] rounded-full 
                        bg-gradient-to-br from-[#FF552833] to-transparent opacity-20 
                        transition-all duration-800 
                        group-hover:scale-125 group-hover:translate-x-5 group-hover:-translate-y-5"> {/* Group hover */}
                    </div>

                    <div className="text-center pt-9 pb-6 relative overflow-hidden">
                        <h1 className="text-4xl font-bold text-[#2c3e50] font-serif inline-block relative 
                         after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 
                         after:-translate-x-1/2 after:w-10 after:h-[3px] after:bg-gradient-to-r 
                         after:from-[#FF5528] after:to-[#FF8C66] after:rounded-full 
                         after:transition-all after:duration-500
                         group-hover:after:w-full"> {/* Group hover */}
                            {title}
                        </h1>
                        <p className="text-sm text-[#7F8C8D] mt-3">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}