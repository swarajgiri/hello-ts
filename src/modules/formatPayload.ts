const formatPayload = ({ status = 200, data = {}, errors = [] } : { status?: any; data?: Object; errors?: Array<{field: string, message: string}> }) => {
  return {
    status,
    data,
    errors
  }
}

export default formatPayload