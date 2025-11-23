
import RoundexFont from './fonts/Roundex.otf';
import logo from "./images/1.png";
import { RxCross2 } from "react-icons/rx";

function Donor( {B}) {
    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
                <div className='bg-[#0f1f1f] p-2 rounded-lg min-h-96 w-1/3'>
                    <div className='flex justify-end text-2x1'>
                        <h4 className='text-[#e0e8e1] text-2xl cursor-pointer hover:bg-[#234444]' onClick={B}><RxCross2 />
</h4>
                    </div>
                    <form action="" className='flex flex-col justify-center items-center'>
                        <div className="flex flex-col items-center gap-2">
                            <img src={logo} alt="Hope Drip Logo" className="w-9 h-8" />
                            <h3 className="text-[#c2d8c4] text-xl font-bold">Hope Drip</h3>
                            <p className='text-gray-400 text-sm'>Registration for Donor</p>
                            <div className='mt-2 flex flex-col'>
                                <input type='text' placeholder='Email ' className='h-10 w-96 rounded-lg p-3 outline-none border border-gray-600 bg-transparent text-white mb-3'></input>
                                <input type='tel' placeholder='Phone' className='h-10 w-96 rounded-lg p-3 outline-none border border-gray-600 bg-transparent text-white mb-3'></input>
                                <input type='numeric' placeholder='CNIC (e.g., 12345-6789012-3)' className='h-10 w-96 rounded-lg p-3 outline-none border border-gray-600 bg-transparent text-white mb-3'></input>
                                <select name="fruits" id="fruit-select" class='h-10 w-96 bg-transparent p-2 outline-none rounded-lg text-white mb-3 border border-gray-600'>
                                <option value="" selected class="bg-gray-800">Choose Blood</option>
                                <option value="apple" class="bg-gray-800">A+</option> 
                                <option value="banana" class="bg-gray-800">A-</option> 
                                <option value="apple" class="bg-gray-800">B+</option> 
                                <option value="banana" class="bg-gray-800">B-</option> 
                                <option value="apple" class="bg-gray-800">AB+</option> 
                                <option value="banana" class="bg-gray-800">AB-</option>
                                <option value="apple" class="bg-gray-800">O+</option> 
                                <option value="banana" class="bg-gray-800">O-</option> 
                                </select>
                            <select name="fruits" id="fruit-select" class='h-10 w-96 bg-transparent p-2 outline-none rounded-lg text-white mb-3 border border-gray-600'>
                                <option value="" selected class="bg-gray-800">Choose City</option>
                                {/* <option value="apple" class="bg-gray-800">A+</option> 
                                <option value="banana" class="bg-gray-800">A-</option> 
                                <option value="apple" class="bg-gray-800">B+</option> 
                                <option value="banana" class="bg-gray-800">B-</option> 
                                <option value="apple" class="bg-gray-800">AB+</option> 
                                <option value="banana" class="bg-gray-800">AB-</option>
                                <option value="apple" class="bg-gray-800">O+</option> 
                                <option value="banana" class="bg-gray-800">O-</option>  */}
                            </select>
                            <textarea className='h-32 bg-transparent p-2 outline-none rounded-lg text-white mb-3 border border-gray-600' placeholder='Address'></textarea>
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                    option {
                                        background-color: #1f2937 !important;
                                        color: white !important;
                                    }
                                `
                            }} />
                            </div>
                            <span className='flex  gap-16 mt-3'>
                                <button className='bg-[#c2d8c4] text-[#0f1f1f] font-semibold px-6 py-2 rounded-md hover:bg-[#a8c4a9] transition'>Register</button>
                            </span>
                        </div>
                    </form>
                    <div class="text-center text-xs text-gray-500 mt-6">© 2025 Hope Drip. All rights reserved.</div>
                </div>
            </div>
        </div>
    );
}

export default Donor;