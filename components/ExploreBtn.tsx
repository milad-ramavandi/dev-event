import Image from "next/image";
import Link from "next/link";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto">
      <Link href="#events">
        Explore Events
        <Image
          src={"/icons/arrow-down.svg"}
          width={24}
          height={24}
          alt="arrow-down"
          className="w-6 h-6"
        />
      </Link>
    </button>
  );
};

export default ExploreBtn;
