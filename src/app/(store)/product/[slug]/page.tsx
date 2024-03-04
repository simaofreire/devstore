import { api } from '@/data/api';
import { Product } from '@/data/types/product';
import { Metadata } from 'next';
import Image from 'next/image';

interface ProductProps {
	params: { slug: string };
}

export default async function Product({ params }: ProductProps) {
	console.log(params.slug);
	const product = await getProduct(params.slug);

	return (
		<div className="relative grid max-h-[860px] grid-cols-3">
			<div className="col-span-2 overflow-hidden">
				<Image src={product.image} alt="" width={1000} height={1000} quality={100} />
			</div>

			<div className="flex flex-col justify-center px-12">
				<h1 className="text-3xl font-bold leading-tight">{product.title}</h1>

				<p className="mt-2 leading-relaxed text-zinc-400">{product.description}</p>

				<div className="mt-8 flex items-center gap-3">
					<span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
						{product.price.toLocaleString('pt-br', {
							style: 'currency',
							currency: 'BRL',
							minimumFractionDigits: 0,
							maximumFractionDigits: 0
						})}
					</span>
					<span className="text-sm text-zinc-400">
						Em até 12x s/ juros de
						{(product.price / 12).toLocaleString('pt-br', {
							style: 'currency',
							currency: 'BRL'
						})}
					</span>
				</div>

				<div className="mt-8 space-y-4">
					<span className="block font-semibold"></span>
					<div className="flex gap-2">
						<button className="flex h-9 w-14 items-center justify-center rounded-full border-zinc-700 bg-zinc-800 font-semibold">
							P
						</button>
						<button className="flex h-9 w-14 items-center justify-center rounded-full border-zinc-700 bg-zinc-800 font-semibold">
							M
						</button>
						<button className="flex h-9 w-14 items-center justify-center rounded-full border-zinc-700 bg-zinc-800 font-semibold">
							G
						</button>
					</div>
				</div>

				<button className="mt-8 flex h-12 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
					Add to cart
				</button>
			</div>
		</div>
	);
}

async function getProduct(slug: string): Promise<Product> {
	const res = await api(`/products/${slug}`, {
		next: {
			revalidate: 60 * 60 // 1 hour
		}
	});

	const product = await res.json();

	return product;
}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
	const product = await getProduct(params.slug);
	return {
		title: product.title
	};
}
