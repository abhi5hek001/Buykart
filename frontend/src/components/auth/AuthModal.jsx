import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle
} from "../ui/dialog";
import { setCredentials } from '../../features/user/userSlice';
import { useLoginMutation, useSignupMutation } from '../../api/apiSlice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthModal = ({ isOpen, onOpenChange }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });

    const dispatch = useDispatch();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                const result = await login({ email: formData.email, password: formData.password }).unwrap();
                dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
                toast.success('Welcome back!');
                onOpenChange(false);
            } else {
                const result = await signup(formData).unwrap();
                dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
                toast.success('Account created successfully!');
                onOpenChange(false);
            }
        } catch (err) {
            toast.error(err?.data?.error || 'Authentication failed');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[750px] p-0 overflow-hidden border-none rounded-sm sm:max-h-[95vh] max-h-screen overflow-y-auto">
                <div className="flex flex-col md:flex-row min-h-[540px] h-auto">
                    {/* Left Pane - Flipkart Branding */}
                    <div className="hidden md:flex w-[40%] bg-[#2874f0] p-8 flex-col text-white sticky top-0">
                        <h2 className="text-[28px] font-semibold mb-4 leading-tight">
                            {isLogin ? 'Login' : "Looks like you're new here!"}
                        </h2>
                        <p className="text-[#dbdbdb] text-[18px] leading-[1.5]">
                            {isLogin
                                ? 'Get access to your Orders, Wishlist and Recommendations'
                                : 'Sign up with your details to get started'}
                        </p>
                        <div className="mt-auto pb-4">
                            <img
                                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
                                alt="Auth Graphic"
                                className="w-full opacity-90"
                            />
                        </div>
                    </div>

                    {/* Right Pane - Forms */}
                    <div className="flex-1 bg-white p-8 sm:p-12 pb-16 relative flex flex-col">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div className="relative border-b border-gray-100 focus-within:border-[#2874f0]">
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full py-2 outline-none text-sm placeholder-gray-400"
                                        placeholder="Enter Name"
                                    />
                                </div>
                            )}

                            <div className="relative border-b border-gray-100 focus-within:border-[#2874f0]">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full py-2 outline-none text-sm placeholder-gray-400"
                                    placeholder="Enter Email/Mobile number"
                                />
                            </div>

                            <div className="relative border-b border-gray-100 focus-within:border-[#2874f0]">
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full py-2 outline-none text-sm placeholder-gray-400"
                                    placeholder="Enter Password"
                                />
                            </div>

                            {!isLogin && (
                                <>
                                    <div className="relative border-b border-gray-100 focus-within:border-[#2874f0]">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full py-2 outline-none text-sm placeholder-gray-400"
                                            placeholder="Enter Phone (Optional)"
                                        />
                                    </div>
                                    <div className="relative border-b border-gray-100 focus-within:border-[#2874f0]">
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full py-2 outline-none text-sm placeholder-gray-400"
                                            placeholder="Enter Address (Optional)"
                                        />
                                    </div>
                                </>
                            )}

                            <p className="text-[12px] text-gray-400">
                                By continuing, you agree to Buykart's <span className="text-[#2874f0]">Terms of Use</span> and <span className="text-[#2874f0]">Privacy Policy.</span>
                            </p>

                            <button
                                type="submit"
                                disabled={isLoginLoading || isSignupLoading}
                                className="w-full bg-[#fb641b] text-white font-medium py-3 rounded-sm shadow-sm hover:brightness-95 transition-all flex items-center justify-center gap-2"
                            >
                                {(isLoginLoading || isSignupLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isLogin ? 'Login' : 'Continue'}
                            </button>

                            <div className="text-center pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-[#2874f0] font-medium text-[14px] hover:bg-white hover:underline border-none p-0"
                                >
                                    {isLogin ? 'New to Buykart? Create an account' : 'Existing User? Log in'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
