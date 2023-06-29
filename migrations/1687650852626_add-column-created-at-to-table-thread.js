exports.up = (pgm) => {
  pgm.addColumn('threads', {
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('threads', ['created_at']);
};
