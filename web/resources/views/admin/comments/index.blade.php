@extends('layouts.admin')
@section('content')
@can('product_create')
    <div style="margin-bottom: 10px;" class="row">
        <div class="col-lg-12">
            <a class="btn btn-success" href="{{ route("admin.products.create") }}">
                {{ trans('global.add') }} {{ trans('global.product.title_singular') }}
            </a>
        </div>
    </div>
@endcan
<div class="card">
    <div class="card-header">
        Comentarios
    </div>

    <div class="card-body">

        <div class="table-responsive">
            <table class=" table table-bordered table-striped table-hover datatable">
                <thead>
                <tr>
                    <th>
                        Id
                    </th>
                    <th>
                        Nombre
                    </th>
                    <th>
                        Calificación
                    </th>
                    <th>
                        Comentario
                    </th>
                </tr>
                </thead>
                <tbody>
                @foreach($comments as $key => $comment)
                    <tr data-entry-id="{{ $comment->id }}">
                        <td>
                            {{ $comment->id ?? '' }}
                        </td>
                        <td>
                            {{ $comment->nombre ?? '' }}
                        </td>
                        <td>
                            {{ $comment->calificacion ?? '' }}
                        </td>
                        <td>
                            <?php echo($comment->comentario ?? '')?>

                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
@section('scripts')
@parent
<script>


</script>
@endsection