const responses = [];

export const addResponse = (response) => {
    if(!response) return;
  responses.push(response);
};

export const getResponses = () => {
  return responses;
};