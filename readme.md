1. Voir tous les types disponibles :
   const query = `  {
    __schema {
      types {
        name
      }
    }
  }`
2. Voir les champs d'un type précis :
   const query = `  {
    __type(name: "user") {
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }`
3. Voir les queries disponibles :
   const query = `  {
    __schema {
      queryType {
        fields {
          name
          description
        }
      }
    }
  }`
