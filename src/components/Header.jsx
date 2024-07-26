import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { SlRefresh } from "react-icons/sl";
import { PiHeartStraightLight } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { TfiMenu } from "react-icons/tfi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useEffect, useState } from "react";
import { productData } from "../static/data";
import DropDown from "./DropDown";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../redux/apiCalls/Cart.ApiCall";

export default function Header() {
	const dispatch = useDispatch();
	const [finalPrice, setFinalPrice] = useState(0);
	const [open, setOpen] = useState(false);
	const { cart } = useSelector((state) => state.cart);
	const { isDeleteSuccess, isAddedSuccess, isSuccess } = useSelector(
		(state) => state.cart
	);
	const [showDropDown, setShowDropDown] = useState(false);
	const [search, setSearch] = useState("");
	const [storeData, setStoreData] = useState([]);
	const [focusSearch, setFocusSearch] = useState(true);
	const { user, token } = useSelector((state) => state.user);

	const changeSearch = (e) => {
		setSearch(e.target.value);
		const v = productData.filter((item) => {
			return item.name.toLowerCase().includes(search.toLowerCase());
		});
		setStoreData(v);
	};

	useEffect(() => {
		if (user) {
			dispatch(getCart({ token }));
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			if (isDeleteSuccess || isAddedSuccess || isSuccess) {
				dispatch(getCart({ token }));
			}
		}
	}, [isDeleteSuccess, isAddedSuccess, isSuccess, user]);

	useEffect(() => {
		if (isSuccess || isAddedSuccess) {
			if (user) {
				let result = 0;
				for (let i = 0; i < cart?.length; i++) {
					result += Number(cart?.[i]?.quantity) * Number(cart?.[i]?.price);
					setFinalPrice(result);
				}
			}
		}
	}, [isSuccess, isAddedSuccess, user]);

	//logout
	const handleLogout = () => {
		localStorage.clear();
		location.reload();
		setOpen(false);
	};
	return (
		<>
			<header className="relative z-[23]">
				<div className="bg-slate-950 text-slate-100">
					<div className="border-b border-[#3b4149]">
						<div className="container flex justify-between py-2 lg:px-0 px-3 text-xs mx-auto">
							<p>Free Shipping Over $100 & Free Returns</p>
							<p>
								Hotline:<a href="+201012345678">+201012345678</a>
							</p>
						</div>
					</div>
					<div className="mx-auto container text-slate-300 lg:px-0 px-2">
						<div className="flex justify-between items-center py-4 lg:flex-nowrap flex-wrap gap-4">
							<div>
								<Link
									to="/"
									className="xl:text-4xl md:text-2xl text-xl font-semibold"
								>
									Mora.
								</Link>
							</div>
							<div
								className="flex items-center order-4 lg:order-2 w-full md:my-0 my-4 lg:min-w-[500px] xl:min-w-[600px] relative lg:max-w-[400px]"
								onBlur={() => setFocusSearch(false)}
							>
								<input
									type="text"
									placeholder="Search Product Here ..."
									className="py-2 px-4 rounded-md rounded-r-none text-slate-800 focus:outline-none w-full text-sm font-semibold h-9"
									onChange={changeSearch}
									onFocus={() => setFocusSearch(true)}
								/>
								<span className="bg-orange-400 h-9 w-14 flex justify-center items-center rounded-r-md hover:bg-orange-300 cursor-pointer">
									<CiSearch className="!text-slate-800 text-lg" />
								</span>
								{search.length && focusSearch ? (
									<div className="absolute top-full left-0 w-full bg-gray-100 shadow rounded-b-lg z-[25] p-2">
										{storeData?.map((item, index) => {
											return (
												<Link
													to={`/products/${item.name
														.toLowerCase()
														.replace(/\s+/g, "-")}`}
													className="flex gap-1 items-center py-1 hover:bg-gray-200"
													key={index}
												>
													<img
														src={item.image_Url[0].url}
														alt="img"
														className="w-8 h-8"
													/>
													<h4 className="text-sm font-semibold text-gray-600">
														{item.name}
													</h4>
												</Link>
											);
										})}
									</div>
								) : null}
							</div>
							<div className="flex lg:gap-4 md:gap-2 gap-1 order-2 lg:order-3 ">
								<Link
									to="/compare"
									className="flex items-center md:gap-2 gap-1 hover:text-slate-50"
								>
									<SlRefresh className="text-3xl font-light" />
									<div className="font-light lg:font-normal text-xs">
										Compare
										<br />
										Products
									</div>
								</Link>
								<Link
									to="/wishlist"
									className="flex items-center md:gap-2 gap-1 hover:text-slate-50"
								>
									<PiHeartStraightLight className="text-3xl" />
									<div className="font-light lg:font-normal text-xs">
										Favourite
										<br />
										Wishlist
									</div>
								</Link>
								{user ? (
									<div className=" relative">
										<div
											className="flex gap-1 items-center hover:text-slate-50 cursor-pointer"
											onClick={() => setOpen((pre) => !pre)}
										>
											<img
												src={`${user?.avatar?.url}`}
												alt="img"
												className="object-cover w-[40px] h-[40px] rounded-full"
											/>
											<span className="text-sm block text-wrap">
												Welcome <br />
												{user.name}
											</span>
										</div>
										{open && (
											<ul className="absolute left-1 top-[calc(100%+10px)] w-40 bg-gray-50 rounded-md text-gray-900 divide-y flex  flex-col gap-1 overflow-hidden text-sm font-medium">
												<Link
													to={"/profile"}
													className=" px-3 py-2  hover:bg-gray-100 w-full text-left cursor-pointer"
													onClick={() => setOpen(false)}
												>
													Profile & details
												</Link>
												<button
													onClick={handleLogout}
													className=" px-3 py-2  hover:bg-gray-100 text-left  cursor-pointer"
												>
													Logout
												</button>
											</ul>
										)}
									</div>
								) : (
									<Link
										to="/login"
										className="flex items-center md:gap-2 gap-1 hover:text-slate-50"
									>
										<CiUser className="text-3xl font-light lg:font-normal" />
										<div className="font-normal text-xs">
											Login
											<br />
											Account
										</div>
									</Link>
								)}
								<Link
									to="/cart"
									className="flex items-center md:gap-2 gap-1 hover:text-slate-50"
								>
									<GiShoppingCart className="text-3xl text-orange-300 font-light lg:font-normal" />
									<div className=" text-sm font-semibold">
										<span className="px-[6px] rounded-full bg-slate-100 text-slate-950 ">
											{user ? cart?.length : 0}
										</span>
										<br /> {user ? finalPrice : 0} $
									</div>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</header>
			<div className="bg-slate-900 text-slate-300 sticky left-0 top-0 z-[21] transition-all">
				<div className="container flex mx-auto px-2 lg:px-0">
					<div className="relative">
						<div
							className="flex gap-2 items-center cursor-pointer lg:w-60 w-36 hover:text-slate-50 py-4"
							onClick={() => setShowDropDown((prev) => !prev)}
						>
							<TfiMenu className="text-xl" />
							<span className="font-bold -mb-1 lg:text-base w-36">
								Categories
							</span>
							<span className="absolute top-[50%] right-0 -translate-y-1/2 text-xl border-r w-8 h-6 border-slate-400 flex justify-start items-center">
								<MdKeyboardArrowDown />
							</span>
						</div>
						{showDropDown && <DropDown setShowDropDown={setShowDropDown} />}
					</div>
					<ul className="flex lg:gap-6 md:gap-3 gap-1 ml-4 sm:text-base text-[12px]">
						<Link
							to="/"
							className="pl-3 py-4 block hover:text-orange-300 transition-all"
						>
							Home
						</Link>
						<Link
							to="/products"
							className="pl-3 py-4 block hover:text-orange-300 transition-all"
						>
							Store
						</Link>
						<Link
							to="/blogs"
							className="pl-3 py-4 block hover:text-orange-300 transition-all"
						>
							Blogs
						</Link>
						<Link
							to="/contact"
							className="pl-3 py-4 block hover:text-orange-300 transition-all"
						>
							Contact
						</Link>
						<Link
							to="/events"
							className="pl-3 py-4 block hover:text-orange-300 transition-all"
						>
							Events
						</Link>
					</ul>
				</div>
			</div>
		</>
	);
}