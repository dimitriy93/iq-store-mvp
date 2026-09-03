interface IProductSkeletonProps {
    index: number;
}

export function ProductSkeleton({index}: IProductSkeletonProps) {
    return (
        <div
            className="catalog-skeleton inner-hairline"
            style={{animationDelay: `${index * 60}ms`}}
        >
            <Shimmer className="catalog-skeleton__plate" delay={index * 90}/>

            <div className="catalog-skeleton__copy">
                <Shimmer className="catalog-skeleton__line catalog-skeleton__line--brand" delay={index * 90 + 60}/>
                <Shimmer className="catalog-skeleton__line catalog-skeleton__line--title" delay={index * 90 + 120}/>
                <Shimmer className="catalog-skeleton__line catalog-skeleton__line--title-short" delay={index * 90 + 160}/>
                <Shimmer className="catalog-skeleton__line catalog-skeleton__line--price" delay={index * 90 + 200}/>
            </div>

            <Shimmer className="catalog-skeleton__button" delay={index * 90 + 240}/>
        </div>
    );
}

function Shimmer({className, delay = 0}: { className: string; delay?: number }) {
    return (
        <div className={`shimmer ${className}`}>
            <div
                className="shimmer__bar"
                style={{animationDelay: `${delay}ms`}}
            />
        </div>
    );
}