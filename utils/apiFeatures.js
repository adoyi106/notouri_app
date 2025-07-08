class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedField = ['sort', 'filter', 'limit', 'page', 'fields'];
    excludedField.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //2.)SORTING
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      // const sortBy = this.query.sort.split(',').join(' ');
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // if (this.query.fields) {
    if (this.queryString.fields) {
      // const fields = this.query.fields.split(',').join(' ');
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // const page = this.query.page * 1 || 1;
    const page = this.queryString.page * 1 || 1;
    // const limit = this.query.limit * 1 || 100;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
