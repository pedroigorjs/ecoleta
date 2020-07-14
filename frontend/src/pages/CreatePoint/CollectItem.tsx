import React, { useState } from 'react';
import { Item } from './styles';

interface Items {
  id: number;
  title: string;
  image_url: string;
}

interface CollectItemProps {
  data: Items;
  handleSelectedItem: any;
}

const CollectItem: React.FC<CollectItemProps> = ({
  data,
  handleSelectedItem,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  function selectedItem(id: number) {
    setIsSelected(old => !old);
    handleSelectedItem(id);
  }

  return (
    <Item onClick={() => selectedItem(data.id)} selected={isSelected}>
      <img src={data.image_url} alt={data.title} />
      <span>{data.title}</span>
    </Item>
  );
};

export default CollectItem;
