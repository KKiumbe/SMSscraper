import React from 'react';
import { Button, FlatList } from 'react-native';

const GroupSelector = ({ selectedGroup, setSelectedGroup }) => {
  const groups = [
    { id: 'all', name: 'All Customers' },
    { id: 'new', name: 'New Customers' },
    { id: 'returning', name: 'Returning Customers' },
  ];

  return (
    <FlatList
      data={groups}
      renderItem={({ item }) => (
        <Button
          title={item.name}
          onPress={() => setSelectedGroup(item)}
          color={selectedGroup?.id === item.id ? 'tomato' : 'gray'}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default GroupSelector;
