import React, { useState } from 'react';
import useContractorDetails from 'Hooks/useContractorDetails';
import { contractor } from 'store/slices/contractorSlice';
import { TbBuildingSkyscraper } from 'react-icons/tb';
interface LogoProps {
  contractorId: string;
  type: string;
  index: number;
  showWinBadge?: boolean;
}

const ContractorLogo = ({ contractorId, index, type, showWinBadge }: LogoProps) => {
  let { image } = useContractorDetails(contractorId, type);
  const [loaderror, setLoaderror] = useState(false);
  return (
    <span className={`p-1 relative rounded-full bg-ashShade-0 ${index === 0 ? '' : '-ml-3'}`}>
      {image && !loaderror ? (
        <img
          loading="lazy"
          decoding="async"
          onError={() => setLoaderror(true)}
          src={image}
          alt=""
          className="w-8 object-cover h-8 rounded-full"
        />
      ) : (
        <TbBuildingSkyscraper size={32} />
      )}

      {showWinBadge && (
        <span className="w-4 h-4 absolute top-0 left-[18px] rounded-full bg-bgreen-0"></span>
      )}
    </span>
  );
};

export default ContractorLogo;
