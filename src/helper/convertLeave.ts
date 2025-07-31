  export const convertToLeaveType = (data: any) => {
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      maxDays: item.max_days,
      color: item.color,
      isSpecial: item.type == "special" ? true : false,
      description: item.description || "No description available",
      isActive: item.is_active
    }));
  };